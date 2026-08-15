// Чистые детекторы жестов по 21 landmark'у MediaPipe (нормализованные [0..1]).
// Кончики пальцев: 4 (большой), 8, 12, 16, 20; PIP-суставы: 6, 10, 14, 18;
// 0 — запястье, 9 — MCP среднего пальца (опора масштаба ладони).
export type LM = { x: number; y: number }[];

const d = (a: { x: number; y: number }, b: { x: number; y: number }) => Math.hypot(a.x - b.x, a.y - b.y);

const FINGERS: readonly [tip: number, pip: number][] = [[8, 6], [12, 10], [16, 14], [20, 18]];

/** Сколько из 4 пальцев (без большого) загнуты: кончик ближе к запястью, чем сустав. */
export function curledCount(lm?: LM): number {
  if (!lm || lm.length < 21) return 0;
  const w = lm[0]!;
  let curled = 0;
  for (const [tip, pip] of FINGERS) {
    if (d(lm[tip]!, w) < d(lm[pip]!, w)) curled++;
  }
  return curled;
}

/** Кулак: ≥3 пальца загнуты. */
export const isFist = (lm?: LM): boolean => curledCount(lm) >= 3;

/** Открытая ладонь: все 4 пальца выпрямлены. */
export const isOpen = (lm?: LM): boolean => !!lm && lm.length >= 21 && curledCount(lm) === 0;

/** Размах ладони (запястье ↔ MCP среднего) — прокси расстояния руки до камеры. */
export function palmSpan(lm?: LM): number {
  if (!lm || lm.length < 21) return 0;
  return d(lm[0]!, lm[9]!);
}

/**
 * Степень раскрытия ладони, непрерывно 0..1: кулак → 0, полная ладонь → 1.
 * Средняя дистанция кончиков пальцев от запястья в долях размаха ладони
 * (инвариантна к расстоянию руки до камеры), линейно [1.15 .. 1.95].
 */
export function openness(lm?: LM): number {
  const span = palmSpan(lm);
  if (!lm || span <= 0) return 0;
  let sum = 0;
  for (const [tip] of FINGERS) sum += d(lm[tip]!, lm[0]!);
  const ratio = sum / 4 / span;
  return Math.min(1, Math.max(0, (ratio - 1.15) / (1.95 - 1.15)));
}
