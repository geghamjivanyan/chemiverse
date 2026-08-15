/// <reference lib="webworker" />
// Воркер распознавания рук: MediaPipe HandLandmarker живёт здесь, чтобы
// инференс (15–40 мс/кадр) не дрался за главный поток с рендером R3F.
// ВАЖНО: воркер КЛАССИЧЕСКИЙ (не module) — wasm-загрузчику MediaPipe нужен
// importScripts, в module-воркере он падает с «ModuleFactory not set».
// ВАЖНО-2: кадр letterbox'ится в КВАДРАТ перед detectForVideo — на неквадратном
// ImageBitmap MediaPipe проецирует landmarks с искажением (предупреждение
// «Using NORM_RECT without IMAGE_DIMENSIONS is only supported for the square ROI»).
// Протокол: main → { type:'init' } | { type:'frame', bitmap, ts } | { type:'stop' }
//           worker → { type:'ready', delegate } | { type:'result', landmarks, ts, inferMs } | { type:'error', msg }
import { FilesetResolver, HandLandmarker } from '@mediapipe/tasks-vision';

type LM = { x: number; y: number }[];

let landmarker: HandLandmarker | null = null;
let delegate: 'GPU' | 'CPU' = 'GPU';
let canvas: OffscreenCanvas | null = null;
let cctx: OffscreenCanvasRenderingContext2D | null = null;

async function init(): Promise<void> {
  const vision = await FilesetResolver.forVisionTasks('/mediapipe/wasm');
  const opts = (d: 'GPU' | 'CPU') => ({
    baseOptions: { modelAssetPath: '/mediapipe/hand_landmarker.task', delegate: d },
    numHands: 2,
    runningMode: 'VIDEO' as const,
    minHandDetectionConfidence: 0.4,
    minHandPresenceConfidence: 0.4,
    minTrackingConfidence: 0.4,
  });
  try {
    landmarker = await HandLandmarker.createFromOptions(vision, opts('GPU'));
    delegate = 'GPU';
  } catch {
    landmarker = await HandLandmarker.createFromOptions(vision, opts('CPU'));
    delegate = 'CPU';
  }
  postMessage({ type: 'ready', delegate });
}

self.onmessage = (e: MessageEvent) => {
  const msg = e.data as { type: string; bitmap?: ImageBitmap; ts?: number };
  if (msg.type === 'init') {
    init().catch((err) => postMessage({ type: 'error', msg: (err as Error).message }));
    return;
  }
  if (msg.type === 'frame' && msg.bitmap) {
    const bmp = msg.bitmap;
    let landmarks: LM[] = [];
    let inferMs = 0;
    try {
      if (landmarker) {
        const w = bmp.width;
        const h = bmp.height;
        const side = Math.max(w, h);
        if (!canvas || canvas.width !== side) {
          canvas = new OffscreenCanvas(side, side);
          cctx = canvas.getContext('2d');
        }
        if (cctx && canvas) {
          const ox = (side - w) / 2;
          const oy = (side - h) / 2;
          cctx.fillStyle = '#000';
          cctx.fillRect(0, 0, side, side);
          cctx.drawImage(bmp, ox, oy);
          const t0 = performance.now();
          const res = landmarker.detectForVideo(canvas, msg.ts ?? performance.now());
          inferMs = performance.now() - t0;
          // координаты — обратно в систему исходного (неквадратного) кадра
          landmarks = ((res.landmarks as LM[]) ?? []).map((hand) =>
            hand.map((p) => ({ x: (p.x * side - ox) / w, y: (p.y * side - oy) / h })),
          );
        }
      }
    } catch (err) {
      postMessage({ type: 'error', msg: `detect: ${(err as Error).message}` });
    } finally {
      bmp.close();
    }
    postMessage({ type: 'result', ts: msg.ts, inferMs, landmarks });
    return;
  }
  if (msg.type === 'stop') {
    landmarker?.close();
    landmarker = null;
    self.close();
  }
};
