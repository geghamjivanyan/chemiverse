import { OneEuro } from './oneEuro';

export interface Hand {
  slot: number; // 0 | 1 — стабильный «слот» руки между кадрами
  x: number; // курсор, экранные пиксели (середина щипка)
  y: number;
  pinch: boolean;
  dist: number; // дистанция щипка (доля ладони) — диагностика
  landmarks: { x: number; y: number }[]; // нормализованные [0..1] — для отрисовки
}

// пороги щипка (доля размера ладони), гистерезис — как в прототипе /hands
const PINCH_ON = 0.38;
const PINCH_OFF = 0.6;
const MAP_MARGIN = 0.12; // центр кадра = весь экран (там трекинг стабильнее)
const HAND_TTL = 320; // держим руку ещё столько мс после потери (антимерцание)
const PREDICT_S = 0.07; // экстраполяция курсора вперёд — прячет задержку камеры+инференса
const PREDICT_MAX = 0.05; // максимум предсказания (нормализованные единицы) — против выбросов
const clamp = (v: number, a: number, b: number) => Math.min(b, Math.max(a, v));

interface Slot {
  fx: OneEuro;
  fy: OneEuro;
  flm: OneEuro[]; // 21 точки × 2 (x,y) — сглаживание скелета руки
  pinch: boolean;
  pinchStreak: number; // подтверждение щипка N кадрами подряд (против ложных)
  lastSeen: number;
  wrist: { x: number; y: number } | null; // нормализ. запястье — для сопоставления
  prev: { x: number; y: number; t: number } | null; // сглаженная позиция прошлого кадра — для предсказания
  last?: Hand;
}
const makeSlot = (): Slot => ({
  fx: new OneEuro(1.1, 15, 1.0),
  fy: new OneEuro(1.1, 15, 1.0),
  flm: Array.from({ length: 42 }, () => new OneEuro(1.5, 10, 1.0)),
  pinch: false,
  pinchStreak: 0,
  lastSeen: 0,
  wrist: null,
  prev: null,
});

export interface TrackStats {
  camFps: number; // реальная частота кадров камеры (rvfc)
  resFps: number; // частота обработанных результатов (после бэкпрешера)
  inferMs: number; // время инференса в воркере (EMA)
  delegate: string; // GPU | CPU | ?
}

type LM = { x: number; y: number }[];

/**
 * Трекинг до двух рук. Инференс MediaPipe — в Web Worker'е (не трогает
 * главный поток), здесь только прокачка кадров c бэкпрешером и лёгкая
 * постобработка: слоты, One Euro, гистерезис щипка, предсказание курсора.
 */
export class HandTracker {
  private worker?: Worker;
  private stream?: MediaStream;
  private raf = 0;
  private rvfc = 0;
  private aborted = false;
  private busy = false; // кадр в полёте — новые пропускаем (латентность не копится)
  private ready = false;
  private readonly slots: Slot[] = [makeSlot(), makeSlot()];
  // диагностика (панель «плавность»)
  private stats: TrackStats = { camFps: 0, resFps: 0, inferMs: 0, delegate: '?' };
  private camCount = 0;
  private resCount = 0;
  private statT = 0;

  getStats(): TrackStats {
    return { ...this.stats };
  }

  private bumpStats(kind: 'cam' | 'res', inferMs?: number): void {
    if (kind === 'cam') this.camCount++;
    else {
      this.resCount++;
      if (inferMs) this.stats.inferMs = this.stats.inferMs ? this.stats.inferMs * 0.8 + inferMs * 0.2 : inferMs;
    }
    const now = performance.now();
    if (!this.statT) this.statT = now;
    if (now - this.statT >= 1000) {
      this.stats.camFps = Math.round((this.camCount * 1000) / (now - this.statT));
      this.stats.resFps = Math.round((this.resCount * 1000) / (now - this.statT));
      this.camCount = 0;
      this.resCount = 0;
      this.statT = now;
    }
  }

  constructor(
    private readonly video: HTMLVideoElement,
    private readonly onFrame: (hands: Hand[]) => void,
    private readonly onError?: (msg: string) => void,
  ) {}

  // живая настройка сглаживания (debug-слайдеры) — на курсор и скелет
  setSmoothing(minCutoff: number, beta: number): void {
    for (const s of this.slots) {
      s.fx.set(minCutoff, beta);
      s.fy.set(minCutoff, beta);
      for (const f of s.flm) f.set(minCutoff, beta);
    }
  }

  async start(): Promise<void> {
    if (!navigator.mediaDevices?.getUserMedia) {
      throw new Error('getUserMedia не поддерживается (нужен HTTPS и современный браузер)');
    }
    // 640×360: инференсу хватает, зато в 2–3 раза быстрее; 60fps — если камера умеет
    this.stream = await navigator.mediaDevices.getUserMedia({
      video: { facingMode: 'user', width: { ideal: 640 }, height: { ideal: 360 }, frameRate: { ideal: 60 } },
      audio: false,
    });
    if (this.aborted) return this.cleanup();
    this.video.srcObject = this.stream;
    this.video.muted = true;
    this.video.setAttribute('playsinline', '');
    try {
      await this.video.play();
    } catch {
      /* play() может прерваться при гонке старт/стоп — безвредно */
    }
    if (this.aborted) return this.cleanup();

    // классический воркер (НЕ module): см. комментарий в hands.worker.ts
    this.worker = new Worker(new URL('./hands.worker.ts', import.meta.url));
    this.worker.onmessage = (e: MessageEvent) => {
      const msg = e.data as { type: string; landmarks?: LM[]; msg?: string; inferMs?: number; delegate?: string };
      if (msg.type === 'ready') {
        this.ready = true;
        this.stats.delegate = msg.delegate ?? '?';
      } else if (msg.type === 'result') {
        this.busy = false;
        this.bumpStats('res', msg.inferMs);
        this.process(msg.landmarks ?? []);
      } else if (msg.type === 'error') {
        this.busy = false;
        this.onError?.(msg.msg ?? 'worker error');
      }
    };
    this.worker.onerror = (e) => this.onError?.(`worker: ${e.message}`);
    this.worker.postMessage({ type: 'init' });

    this.schedule();
  }

  private schedule(): void {
    if (this.aborted) return;
    const v = this.video as HTMLVideoElement & {
      requestVideoFrameCallback?: (cb: () => void) => number;
    };
    if (typeof v.requestVideoFrameCallback === 'function') {
      this.rvfc = v.requestVideoFrameCallback(() => this.tick());
    } else {
      this.raf = requestAnimationFrame(() => this.tick());
    }
  }

  private tick = (): void => {
    if (this.aborted) return;
    this.bumpStats('cam');
    if (this.ready && !this.busy && this.worker && this.video.readyState >= 2) {
      this.busy = true;
      const ts = performance.now();
      createImageBitmap(this.video)
        .then((bmp) => {
          if (this.aborted || !this.worker) {
            bmp.close();
            this.busy = false;
            return;
          }
          this.worker.postMessage({ type: 'frame', bitmap: bmp, ts }, [bmp]);
        })
        .catch(() => {
          this.busy = false;
        });
    }
    this.schedule();
  };

  /** Сопоставляем найденные руки со слотами по ближайшему запястью, затем считаем состояние. */
  private process(raw: LM[]): void {
    const now = performance.now();
    const dets = raw.slice(0, 2).filter((h) => h[0] && h[4] && h[5] && h[8] && h[9] && h[17]);

    // жадное сопоставление detection → slot по запястью (точка 0)
    const slotForDet: number[] = new Array(dets.length).fill(-1);
    const usedSlot = new Set<number>();
    const pairs: { d: number; det: number; slot: number }[] = [];
    dets.forEach((h, di) => {
      this.slots.forEach((s, si) => {
        if (s.wrist && now - s.lastSeen < HAND_TTL) {
          pairs.push({ d: Math.hypot(h[0]!.x - s.wrist.x, h[0]!.y - s.wrist.y), det: di, slot: si });
        }
      });
    });
    pairs.sort((a, b) => a.d - b.d);
    for (const p of pairs) {
      if (slotForDet[p.det] === -1 && !usedSlot.has(p.slot)) {
        slotForDet[p.det] = p.slot;
        usedSlot.add(p.slot);
      }
    }
    // свободным detection'ам — свободные слоты
    dets.forEach((_, di) => {
      if (slotForDet[di] === -1) {
        const free = this.slots.findIndex((_, si) => !usedSlot.has(si));
        if (free >= 0) {
          slotForDet[di] = free;
          usedSlot.add(free);
        }
      }
    });

    const out: Hand[] = [];
    dets.forEach((h, di) => {
      const si = slotForDet[di];
      if (si === undefined || si < 0) return;
      out[si] = this.compute(this.slots[si]!, si, h, now);
    });

    // удержание потерянных слотов в пределах TTL
    this.slots.forEach((s, si) => {
      if (!out[si] && s.last && now - s.lastSeen < HAND_TTL) out[si] = s.last;
    });

    this.onFrame(out.filter(Boolean));
  }

  private compute(slot: Slot, si: number, h: LM, now: number): Hand {
    const thumb = h[4]!;
    const tip = h[8]!;
    const wrist = h[0]!;
    const mcp = h[9]!;
    // масштаб ладони, устойчивый к повороту кисти: max из длины (запястье↔MCP
    // среднего) и ширины (MCP указательного↔мизинца, ×1.5 до сопоставимых единиц).
    // Одна проекция схлопывается при развороте — вторая выживает; иначе при
    // ладони ребром ref→0 и любые пальцы выглядят «щипком».
    const ref = Math.max(
      Math.hypot(wrist.x - mcp.x, wrist.y - mcp.y),
      Math.hypot(h[5]!.x - h[17]!.x, h[5]!.y - h[17]!.y) * 1.5,
    ) || 1e-4;
    const d = Math.hypot(thumb.x - tip.x, thumb.y - tip.y) / ref;
    if (slot.pinch) {
      if (d > PINCH_OFF) slot.pinch = false;
    } else if (d < PINCH_ON) {
      // подтверждение двумя кадрами подряд — одиночный выброс не кликает
      slot.pinchStreak++;
      if (slot.pinchStreak >= 2) slot.pinch = true;
    } else {
      slot.pinchStreak = 0;
    }

    const t = now / 1000;
    const mx = slot.fx.filter((thumb.x + tip.x) / 2, t);
    const my = slot.fy.filter((thumb.y + tip.y) / 2, t);

    // предсказание по скорости: курсор экстраполируется на PREDICT_S вперёд —
    // прячет задержку выдержки камеры + инференса; кламп против выбросов
    let px = mx;
    let py = my;
    if (slot.prev) {
      const dt = Math.max(1e-3, t - slot.prev.t);
      px = mx + clamp(((mx - slot.prev.x) / dt) * PREDICT_S, -PREDICT_MAX, PREDICT_MAX);
      py = my + clamp(((my - slot.prev.y) / dt) * PREDICT_S, -PREDICT_MAX, PREDICT_MAX);
    }
    slot.prev = { x: mx, y: my, t };

    const nx = clamp((1 - px - MAP_MARGIN) / (1 - 2 * MAP_MARGIN), 0, 1);
    const ny = clamp((py - MAP_MARGIN) / (1 - 2 * MAP_MARGIN), 0, 1);

    slot.lastSeen = now;
    slot.wrist = { x: wrist.x, y: wrist.y };
    const hand: Hand = {
      slot: si,
      x: nx * window.innerWidth,
      y: ny * window.innerHeight,
      pinch: slot.pinch,
      dist: d,
      landmarks: h.map((p, i) => ({ x: slot.flm[i * 2]!.filter(p.x, t), y: slot.flm[i * 2 + 1]!.filter(p.y, t) })),
    };
    slot.last = hand;
    return hand;
  }

  private cleanup(): void {
    cancelAnimationFrame(this.raf);
    const v = this.video as HTMLVideoElement & { cancelVideoFrameCallback?: (h: number) => void };
    if (this.rvfc && typeof v.cancelVideoFrameCallback === 'function') {
      v.cancelVideoFrameCallback(this.rvfc);
    }
    this.stream?.getTracks().forEach((tr) => tr.stop());
    this.stream = undefined;
    if (this.video.srcObject) this.video.srcObject = null;
    this.worker?.postMessage({ type: 'stop' });
    this.worker?.terminate();
    this.worker = undefined;
    this.ready = false;
  }

  stop(): void {
    this.aborted = true;
    this.cleanup();
  }
}
