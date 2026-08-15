import { elements } from './elements';
import type { Element, ElementCategory } from './types';

export { elements };

export const byZ: ReadonlyMap<number, Element> = new Map(elements.map((e) => [e.z, e]));
export const bySymbol: ReadonlyMap<string, Element> = new Map(
  elements.map((e) => [e.symbol, e]),
);

/** Получить элемент по Z (число) или по символу (строка). */
export function getElement(key: number | string): Element | undefined {
  return typeof key === 'number' ? byZ.get(key) : bySymbol.get(key);
}

/** Размер сетки: 18 групп; ряды 1..7 + 9..10 (вынесенный f-блок), 8 — пустой разделитель. */
export const GRID_COLS = 18;
export const GRID_ROWS = 10;

/** Порядок категорий для легенды. */
export const CATEGORY_ORDER: readonly ElementCategory[] = [
  'alkali-metal',
  'alkaline-earth-metal',
  'transition-metal',
  'post-transition-metal',
  'metalloid',
  'nonmetal',
  'halogen',
  'noble-gas',
  'lanthanide',
  'actinide',
  'unknown',
];

// Человекочитаемые подписи категорий и фаз локализованы в UI (web/src/i18n).
// Здесь — только ключи (CATEGORY_ORDER) как источник правды о наборе категорий.
