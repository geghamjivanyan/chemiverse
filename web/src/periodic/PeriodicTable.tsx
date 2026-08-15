import { useCallback, useMemo } from 'react';
import type { KeyboardEvent } from 'react';
import { elements, byZ } from '@chemverse/shared';
import { ElementTile } from './ElementTile';
import { useI18n } from '../i18n';

const GROUPS = Array.from({ length: 18 }, (_, i) => i + 1);
const PERIODS = [1, 2, 3, 4, 5, 6, 7];

// Карта позиция -> Z для пространственной навигации стрелками.
const posMap = new Map<string, number>(elements.map((e) => [`${e.xpos}:${e.ypos}`, e.z]));

function neighbor(z: number, dx: number, dy: number): number | null {
  const e = byZ.get(z);
  if (!e) return null;
  for (let step = 1; step <= 18; step++) {
    const hit = posMap.get(`${e.xpos + dx * step}:${e.ypos + dy * step}`);
    if (hit) return hit;
  }
  return null;
}

interface Props {
  selected: number | null;
  query: string;
  filterCats: ReadonlySet<string>;
  onSelect: (z: number) => void;
}

export function PeriodicTable({ selected, query, filterCats, onSelect }: Props) {
  const { locale } = useI18n();

  const matches = useCallback(
    (z: number): boolean => {
      const q = query.trim().toLowerCase();
      if (!q) return true;
      const e = byZ.get(z)!;
      if (/^\d+$/.test(q)) return e.z === Number(q);
      if (e.symbol.toLowerCase().startsWith(q)) return true;
      // ищем по названиям на всех языках
      return Object.values(e.names).some((n) => n.toLowerCase().includes(q));
    },
    [query],
  );

  const onKeyDown = useCallback(
    (ev: KeyboardEvent) => {
      const dirs: Record<string, [number, number]> = {
        ArrowLeft: [-1, 0],
        ArrowRight: [1, 0],
        ArrowUp: [0, -1],
        ArrowDown: [0, 1],
      };
      const d = dirs[ev.key];
      if (!d) return;
      ev.preventDefault();
      const cur = selected ?? 1;
      const next = neighbor(cur, d[0], d[1]);
      if (next) {
        onSelect(next);
        document.querySelector<HTMLButtonElement>(`.tile[data-z="${next}"]`)?.focus();
      }
    },
    [selected, onSelect],
  );

  const tiles = useMemo(
    () =>
      elements.map((e) => {
        const dimmed =
          (!!query.trim() && !matches(e.z)) ||
          (filterCats.size > 0 && !filterCats.has(e.category));
        return (
          <ElementTile
            key={e.z}
            element={e}
            locale={locale}
            selected={selected === e.z}
            dimmed={dimmed}
            onSelect={onSelect}
          />
        );
      }),
    [selected, query, filterCats, locale, matches, onSelect],
  );

  return (
    <div
      className="ptable"
      role="grid"
      aria-label="Таблица Менделеева"
      onKeyDown={onKeyDown}
    >
      {/* заголовки групп */}
      {GROUPS.map((g) => (
        <div key={`g${g}`} className="axis axis-group" style={{ gridColumn: g + 1, gridRow: 1 }}>
          {g}
        </div>
      ))}
      {/* номера периодов */}
      {PERIODS.map((p) => (
        <div key={`p${p}`} className="axis axis-period" style={{ gridColumn: 1, gridRow: p + 1 }}>
          {p}
        </div>
      ))}
      {/* маркеры f-блока в разрыве группы 3 */}
      <div className="fmark" style={{ gridColumn: 4, gridRow: 7 }}>
        57–71
      </div>
      <div className="fmark" style={{ gridColumn: 4, gridRow: 8 }}>
        89–103
      </div>

      {tiles}
    </div>
  );
}
