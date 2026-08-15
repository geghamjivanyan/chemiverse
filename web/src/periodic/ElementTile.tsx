import { memo } from 'react';
import type { CSSProperties } from 'react';
import type { Element, Locale } from '@chemverse/shared';
import { CATEGORY_COLORS } from './colors';

interface Props {
  element: Element;
  locale: Locale;
  selected: boolean;
  dimmed: boolean;
  onSelect: (z: number) => void;
}

export const ElementTile = memo(function ElementTile({
  element,
  locale,
  selected,
  dimmed,
  onSelect,
}: Props) {
  const color = CATEGORY_COLORS[element.category];
  return (
    <button
      type="button"
      className={`tile${selected ? ' is-selected' : ''}${dimmed ? ' is-dimmed' : ''}`}
      style={
        {
          gridColumn: element.xpos + 1,
          gridRow: element.ypos + 1,
          '--c': color,
        } as CSSProperties
      }
      onClick={() => onSelect(element.z)}
      aria-pressed={selected}
      aria-label={`${element.names[locale]}, ${element.symbol}, ${element.z}`}
      data-z={element.z}
    >
      <span className="tile-z">{element.z}</span>
      <span className="tile-sym">{element.symbol}</span>
      <span className="tile-name">{element.names[locale]}</span>
      <span className="tile-mass">{element.mass.toFixed(element.mass < 10 ? 3 : 1)}</span>
    </button>
  );
});
