import type { ElementCategory } from '@chemverse/shared';

/** Неоновая палитра категорий для тёмной темы (см. /var/www/claude/docs/05-visual-design.md). */
export const CATEGORY_COLORS: Record<ElementCategory, string> = {
  'alkali-metal': '#ff6b6b',
  'alkaline-earth-metal': '#ffa94d',
  'transition-metal': '#4dabf7',
  'post-transition-metal': '#748ffc',
  metalloid: '#20c997',
  nonmetal: '#51cf66',
  halogen: '#22b8cf',
  'noble-gas': '#cc5de8',
  lanthanide: '#f783ac',
  actinide: '#e64980',
  unknown: '#868e96',
};
