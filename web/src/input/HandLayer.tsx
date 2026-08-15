import { useEffect, useRef, useState } from 'react';
import { HandTracker, type Hand } from './hands';
import { handsBus, gestureModeBus } from './handsBus';
import { useI18n } from '../i18n';

type Status = 'loading' | 'on' | 'denied';

// топология кисти (21 точка MediaPipe)
const HAND_CONNECTIONS: [number, number][] = [
  [0, 1], [1, 2], [2, 3], [3, 4],
  [0, 5], [5, 6], [6, 7], [7, 8],
  [5, 9], [9, 10], [10, 11], [11, 12],
  [9, 13], [13, 14], [14, 15], [15, 16],
  [13, 17], [17, 18], [18, 19], [19, 20],
  [0, 17],
];

// скорость подтягивания курсора к цели (больше = отзывчивее/резче, меньше = глаже/с задержкой)
const CURSOR_SMOOTH = 22;
// дефолты One Euro для debug-слайдеров (применяются к курсору и скелету)
const MC0 = 1.1;
const BETA0 = 15;

function fireMouse(type: string, el: Element, x: number, y: number, related?: Element | null) {
  el.dispatchEvent(
    new MouseEvent(type, {
      bubbles: true,
      cancelable: true,
      view: window,
      clientX: x,
      clientY: y,
      relatedTarget: related ?? null,
    }),
  );
}
function firePointer(type: string, el: Element, x: number, y: number) {
  el.dispatchEvent(
    new PointerEvent(type, {
      bubbles: true,
      cancelable: true,
      view: window,
      clientX: x,
      clientY: y,
      pointerId: 1,
      pointerType: 'touch',
      isPrimary: true,
    }),
  );
}

export function HandLayer({
  onDisable,
  clickEnabled = true,
}: {
  onDisable: () => void;
  clickEnabled?: boolean;
}) {
  const { t } = useI18n();
  const clickRef = useRef(clickEnabled);
  clickRef.current = clickEnabled;
  const videoRef = useRef<HTMLVideoElement>(null);
  const cursorRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const liveRef = useRef<HTMLSpanElement>(null);
  const lastEl = useRef<Element | null>(null);
  const pinchPrev = useRef(false);
  // цель (из распознавания) и отображаемая позиция (плавно подтягивается в rAF)
  const targetRef = useRef({ x: 0, y: 0, pinch: false, dist: 2, has: false });
  const dispRef = useRef({ x: 0, y: 0 });
  const visibleRef = useRef(false);
  const rafRef = useRef(0);
  const lastTRef = useRef(0);
  const [status, setStatus] = useState<Status>('loading');
  const [err, setErr] = useState<string | null>(null);
  // debug-слайдеры One Euro (minCutoff/beta) — живая настройка плавности
  const trackerRef = useRef<HandTracker | null>(null);
  const [mc, setMc] = useState(MC0);
  const [beta, setBeta] = useState(BETA0);
  const [showTune, setShowTune] = useState(false);
  useEffect(() => { trackerRef.current?.setSmoothing(mc, beta); }, [mc, beta]);

  // живая диагностика конвейера (камера/инференс) — в открытой панели, 2 Гц
  const [stats, setStats] = useState({ camFps: 0, resFps: 0, inferMs: 0, delegate: '?' });
  useEffect(() => {
    if (!showTune) return;
    const id = setInterval(() => {
      const s = trackerRef.current?.getStats();
      if (s) setStats(s);
    }, 500);
    return () => clearInterval(id);
  }, [showTune]);

  // стабильные ссылки — чтобы эффект НЕ перезапускался при ре-рендерах App
  const onDisableRef = useRef(onDisable);
  onDisableRef.current = onDisable;
  const hintRef = useRef(t.handsHint);
  hintRef.current = t.handsHint;

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    let cancelled = false;

    const setHover = (el: Element | null, x: number, y: number) => {
      const prev = lastEl.current;
      if (el === prev) {
        if (el) fireMouse('mousemove', el, x, y);
        return;
      }
      if (prev) {
        fireMouse('mouseout', prev, x, y, el);
        fireMouse('mouseleave', prev, x, y, el);
      }
      if (el) {
        fireMouse('mouseover', el, x, y, prev);
        fireMouse('mouseenter', el, x, y, prev);
        fireMouse('mousemove', el, x, y);
      }
      lastEl.current = el;
    };

    const drawSkeleton = (hands: Hand[]) => {
      const cv = canvasRef.current;
      const ctx = cv?.getContext('2d');
      if (!cv || !ctx) return;
      if (video.videoWidth && cv.width !== video.videoWidth) {
        cv.width = video.videoWidth;
        cv.height = video.videoHeight;
      }
      ctx.clearRect(0, 0, cv.width, cv.height);
      for (const hand of hands) {
        const lm = hand.landmarks;
        ctx.strokeStyle = 'rgba(54, 227, 255, 0.55)';
        ctx.lineWidth = 1.5;
        for (const [i, j] of HAND_CONNECTIONS) {
          const p = lm[i];
          const q = lm[j];
          if (!p || !q) continue;
          ctx.beginPath();
          ctx.moveTo(p.x * cv.width, p.y * cv.height);
          ctx.lineTo(q.x * cv.width, q.y * cv.height);
          ctx.stroke();
        }
        ctx.fillStyle = '#36e3ff';
        for (const p of lm) {
          ctx.beginPath();
          ctx.arc(p.x * cv.width, p.y * cv.height, 3, 0, Math.PI * 2);
          ctx.fill();
        }
        const a = lm[4];
        const b = lm[8];
        if (a && b) {
          ctx.strokeStyle = hand.pinch ? '#ff5a5a' : '#36e3ff';
          ctx.lineWidth = 2.5;
          ctx.beginPath();
          ctx.moveTo(a.x * cv.width, a.y * cv.height);
          ctx.lineTo(b.x * cv.width, b.y * cv.height);
          ctx.stroke();
        }
      }
    };

    const handle = (hands: Hand[]) => {
      handsBus.set(hands); // отдаём кадр в 3D-сцену (режим «Лупа»)
      drawSkeleton(hands);
      if (liveRef.current) {
        liveRef.current.textContent = hands.length
          ? `✓×${hands.length} · ${hands[0]!.dist.toFixed(2)}`
          : hintRef.current;
      }
      const primary = hands[0];
      if (!primary) {
        targetRef.current.has = false;
        pinchPrev.current = false;
        return;
      }
      const { x, y, pinch, dist } = primary;
      targetRef.current.x = x;
      targetRef.current.y = y;
      targetRef.current.pinch = pinch;
      targetRef.current.dist = dist;
      targetRef.current.has = true;

      // клик по щипку — в точке, где курсор сейчас виден (плавная позиция)
      if (pinch && !pinchPrev.current && clickRef.current) {
        const dx = visibleRef.current ? dispRef.current.x : x;
        const dy = visibleRef.current ? dispRef.current.y : y;
        const el = document.elementFromPoint(dx, dy);
        if (el) {
          firePointer('pointerdown', el, dx, dy);
          fireMouse('mousedown', el, dx, dy);
          firePointer('pointerup', el, dx, dy);
          fireMouse('mouseup', el, dx, dy);
          fireMouse('click', el, dx, dy);
          cursorRef.current?.classList.add('clicked');
          setTimeout(() => cursorRef.current?.classList.remove('clicked'), 160);
        }
      }
      pinchPrev.current = pinch;
    };

    // 60-fps цикл: плавно подтягиваем курсор к цели (отвязано от частоты камеры)
    const tick = (now: number) => {
      const dt = Math.min(0.05, (now - lastTRef.current) / 1000) || 0.016;
      lastTRef.current = now;
      const cur = cursorRef.current;
      const tg = targetRef.current;
      if (cur) {
        if (!tg.has) {
          cur.style.opacity = '0';
          if (visibleRef.current) setHover(null, 0, 0);
          visibleRef.current = false;
        } else {
          if (!visibleRef.current) { dispRef.current.x = tg.x; dispRef.current.y = tg.y; visibleRef.current = true; }
          const k = 1 - Math.exp(-dt * CURSOR_SMOOTH);
          dispRef.current.x += (tg.x - dispRef.current.x) * k;
          dispRef.current.y += (tg.y - dispRef.current.y) * k;
          const dx = dispRef.current.x;
          const dy = dispRef.current.y;
          cur.style.opacity = '1';
          cur.style.transform = `translate(${dx}px, ${dy}px)`;
          cur.classList.toggle('pinching', tg.pinch);
          // прогресс щипка: кольцо сжимается по мере сближения пальцев —
          // видно заранее, когда сработает захват
          const pp = tg.pinch ? 1 : Math.min(1, Math.max(0, (0.95 - tg.dist) / (0.95 - 0.38)));
          cur.style.setProperty('--pp', pp.toFixed(3));
          const modeEl = cur.querySelector<HTMLElement>('.hc-mode');
          if (modeEl) {
            const m = gestureModeBus.get();
            if (modeEl.textContent !== m) modeEl.textContent = m;
          }
          setHover(document.elementFromPoint(dx, dy), dx, dy);
        }
      }
      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);

    const tracker = new HandTracker(video, handle, (m) => !cancelled && setErr(m));
    trackerRef.current = tracker;
    tracker.setSmoothing(MC0, BETA0);
    tracker
      .start()
      .then(() => {
        if (!cancelled) setStatus('on');
      })
      .catch((e: unknown) => {
        const msg = e instanceof Error ? `${e.name}: ${e.message}` : String(e);
        console.warn('hand tracking failed:', msg);
        if (!cancelled) {
          setErr(msg);
          setStatus('denied');
          setTimeout(() => onDisableRef.current(), 4000);
        }
      });

    return () => {
      cancelled = true;
      cancelAnimationFrame(rafRef.current);
      trackerRef.current = null;
      tracker.stop();
      const prev = lastEl.current;
      if (prev) fireMouse('mouseout', prev, 0, 0, null);
      lastEl.current = null;
    };
  }, []);

  return (
    <div className="hand-layer">
      <div ref={cursorRef} className="hand-cursor" style={{ opacity: 0 }}>
        <span className="hc-ring" />
        <span className="hc-dot" />
        <span className="hc-mode" />
      </div>
      <div className="hand-cam" data-status={status}>
        <video ref={videoRef} className="hand-video" playsInline muted />
        <canvas ref={canvasRef} className="hand-skel" />
        <div className="hand-cam-label">
          {status === 'loading' && t.loadingModel}
          {status === 'denied' && (err ?? t.cameraDenied)}
          {status === 'on' && <span ref={liveRef}>{t.handsHint}</span>}
        </div>
      </div>

      {status === 'on' && (
        <div style={{ position: 'fixed', right: 12, bottom: 12, zIndex: 80, pointerEvents: 'auto', fontFamily: 'ui-monospace, monospace', fontSize: 12 }}>
          {showTune && (
            <div style={{ width: 210, marginBottom: 6, padding: 12, borderRadius: 10, background: 'rgba(18,20,26,0.94)', border: '1px solid rgba(255,255,255,0.12)', color: '#cdd6e4', backdropFilter: 'blur(8px)' }}>
              <div style={{ marginBottom: 10 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}><span>minCutoff</span><b>{mc.toFixed(2)}</b></div>
                <input type="range" min={0.1} max={3} step={0.05} value={mc} onChange={(e) => setMc(+e.target.value)} style={{ width: '100%' }} />
                <div style={{ opacity: 0.55, fontSize: 11 }}>↑ меньше лага · ↓ глаже в покое</div>
              </div>
              <div style={{ marginBottom: 8 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}><span>beta</span><b>{beta.toFixed(1)}</b></div>
                <input type="range" min={0} max={40} step={0.5} value={beta} onChange={(e) => setBeta(+e.target.value)} style={{ width: '100%' }} />
                <div style={{ opacity: 0.55, fontSize: 11 }}>↑ резче догоняет в движении</div>
              </div>
              <button onClick={() => { setMc(MC0); setBeta(BETA0); }} style={{ width: '100%', padding: '4px 0', borderRadius: 6, background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.14)', color: '#cdd6e4', cursor: 'pointer' }}>
                сброс ({MC0} / {BETA0})
              </button>
              {/* диагностика: camFps<20 → мало света; inferMs>40 → слабый GPU/CPU-делегат */}
              <div style={{ marginTop: 10, paddingTop: 8, borderTop: '1px solid rgba(255,255,255,0.1)', opacity: 0.85, lineHeight: 1.7 }}>
                <div>камера: <b>{stats.camFps}</b> fps · обработка: <b>{stats.resFps}</b> fps</div>
                <div>инференс: <b>{stats.inferMs.toFixed(0)}</b> мс · <b>{stats.delegate}</b></div>
              </div>
            </div>
          )}
          <button onClick={() => setShowTune((v) => !v)} style={{ float: 'right', padding: '5px 10px', borderRadius: 8, background: 'rgba(18,20,26,0.94)', border: '1px solid rgba(255,255,255,0.12)', color: '#cdd6e4', cursor: 'pointer', backdropFilter: 'blur(8px)' }}>
            ⚙ {showTune ? 'скрыть' : 'плавность'}
          </button>
        </div>
      )}
    </div>
  );
}
