import { describe, expect, it } from 'vitest';
import { curledCount, isFist, isOpen, openness, palmSpan, type LM } from './gestures';

// Синтетический скелет: запястье в (0.5, 0.9), пальцы вверх.
// straight — кончик дальше от запястья, чем PIP; curled — наоборот.
function hand(curled: boolean[]): LM {
  const lm: LM = Array.from({ length: 21 }, () => ({ x: 0.5, y: 0.9 }));
  lm[0] = { x: 0.5, y: 0.9 };
  lm[9] = { x: 0.5, y: 0.6 }; // MCP среднего — размах ладони 0.3
  const fingers: [tip: number, pip: number, x: number][] = [
    [8, 6, 0.42], [12, 10, 0.48], [16, 14, 0.54], [20, 18, 0.6],
  ];
  fingers.forEach(([tip, pip, x], i) => {
    lm[pip] = { x, y: 0.55 };
    lm[tip] = curled[i] ? { x, y: 0.75 } : { x, y: 0.3 }; // загнут → кончик ближе к запястью
  });
  return lm;
}

describe('жестовые примитивы', () => {
  it('curledCount считает загнутые пальцы', () => {
    expect(curledCount(hand([false, false, false, false]))).toBe(0);
    expect(curledCount(hand([true, true, false, false]))).toBe(2);
    expect(curledCount(hand([true, true, true, true]))).toBe(4);
  });

  it('кулак: ≥3 загнутых; открытая ладонь: 0', () => {
    expect(isFist(hand([true, true, true, false]))).toBe(true);
    expect(isFist(hand([true, true, false, false]))).toBe(false);
    expect(isOpen(hand([false, false, false, false]))).toBe(true);
    expect(isOpen(hand([true, false, false, false]))).toBe(false);
  });

  it('palmSpan — дистанция запястье↔MCP среднего', () => {
    expect(palmSpan(hand([false, false, false, false]))).toBeCloseTo(0.3, 5);
  });

  it('openness: кулак → 0, ладонь → 1, монотонно между', () => {
    expect(openness(hand([true, true, true, true]))).toBe(0);
    expect(openness(hand([false, false, false, false]))).toBe(1);
    const half = openness(hand([true, true, false, false]));
    expect(half).toBeGreaterThan(0);
    expect(half).toBeLessThan(1);
  });

  it('обрезанные/пустые данные безопасны', () => {
    expect(curledCount(undefined)).toBe(0);
    expect(isFist([])).toBe(false);
    expect(isOpen([{ x: 0, y: 0 }])).toBe(false);
    expect(palmSpan(undefined)).toBe(0);
  });
});
