import type { CSSProperties } from 'react';
import { CATEGORY_ORDER, elements } from '@chemverse/shared';
import type { ElementCategory } from '@chemverse/shared';
import { X } from 'lucide-react';
import { CATEGORY_COLORS } from './colors';
import { cn } from '@/lib/utils';
import { useI18n } from '../i18n';

const COUNTS = elements.reduce<Record<string, number>>((acc, e) => {
  acc[e.category] = (acc[e.category] ?? 0) + 1;
  return acc;
}, {});

export function Legend({
  selected,
  onToggle,
  onReset,
}: {
  selected: ReadonlySet<ElementCategory>;
  onToggle: (cat: ElementCategory) => void;
  onReset: () => void;
}) {
  const { t } = useI18n();
  return (
    <div className="flex flex-wrap items-center gap-1.5">
      {CATEGORY_ORDER.filter((c) => COUNTS[c]).map((cat) => {
        const active = selected.has(cat);
        const color = CATEGORY_COLORS[cat];
        return (
          <button
            key={cat}
            type="button"
            aria-pressed={active}
            onClick={() => onToggle(cat)}
            style={
              active
                ? ({ borderColor: color, background: `color-mix(in srgb, ${color} 16%, transparent)` } as CSSProperties)
                : undefined
            }
            className={cn(
              'inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs transition-colors',
              active ? 'text-foreground' : 'border-border text-muted-foreground hover:text-foreground',
            )}
          >
            <span className="size-2 rounded-full" style={{ background: color }} />
            {t.categories[cat]}
            <span className="font-mono text-[10px] text-muted-foreground">{COUNTS[cat]}</span>
          </button>
        );
      })}
      {selected.size > 0 && (
        <button
          type="button"
          onClick={onReset}
          className="inline-flex items-center gap-1 rounded-full px-2 py-1 text-xs text-muted-foreground hover:text-foreground"
        >
          <X className="size-3" />
          {t.reset}
        </button>
      )}
    </div>
  );
}
