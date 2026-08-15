/**
 * ScreenSidebar — the learning guide, driven by the Progress Engine.
 * It lists every screen and reflects its progress state (not-started / viewed /
 * in-progress / completed) plus overall lesson progress. Clicking a screen jumps
 * to it; nothing is ever locked. Visuals reuse the existing sidebar style — this
 * component only *displays* progress; it computes nothing.
 */
import { CheckCircle2, CircleDot, MapPin, Circle } from 'lucide-react';
import { V } from '../visual/tokens';
import type { Screen } from './model';
import type { ScreenState } from './useProgress';

const STATE_META: Record<ScreenState, { Icon: typeof CheckCircle2; cls: string; label: string }> = {
  completed: { Icon: CheckCircle2, cls: 'text-emerald-600', label: 'Ավարտված' },
  'in-progress': { Icon: MapPin, cls: 'text-primary', label: 'Ընթացիկ' },
  viewed: { Icon: CircleDot, cls: 'text-primary/70', label: 'Դիտված' },
  'not-started': { Icon: Circle, cls: 'text-muted-foreground/40', label: 'Չսկսված' },
};

export function ScreenSidebar({ lessonTitle, screens, activeId, screenState, completedCount, totalScreens, overallPercent, onSelect }: {
  lessonTitle: string;
  screens: Screen[];
  activeId: string | null;
  screenState: (id: string, activeId?: string | null) => ScreenState;
  completedCount: number;
  totalScreens: number;
  overallPercent: number;
  onSelect: (screenId: string) => void;
}) {
  const remaining = totalScreens - completedCount;

  return (
    <div className="flex h-full flex-col p-3">
      <div className={V.sectionLabel}>Դաս</div>
      <div className="text-sm font-semibold text-foreground">{lessonTitle}</div>

      <div className={`mt-4 ${V.sectionLabel}`}>Քայլեր</div>
      <nav className="mt-1 min-h-0 flex-1 space-y-0.5 overflow-auto">
        {screens.map((s) => {
          const state = screenState(s.id, activeId);
          const { Icon, cls, label } = STATE_META[state];
          const done = state === 'completed';
          const current = state === 'in-progress';
          const title = s.title ?? `Քայլ ${s.stepIndex + 1}`;
          return (
            <button
              key={s.id}
              type="button"
              onClick={() => onSelect(s.id)}
              title={label}
              className={`flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-left text-sm transition ${
                current ? 'bg-accent ring-1 ring-primary/40' : 'hover:bg-accent'
              }`}
            >
              <Icon className={`size-4 shrink-0 ${cls}`} />
              <span className={`line-clamp-1 flex-1 ${done ? 'text-muted-foreground' : 'text-foreground'}`}>{title}</span>
              {current && <span className="shrink-0 text-[10px] font-medium uppercase tracking-wide text-primary">Հիմա</span>}
            </button>
          );
        })}
      </nav>

      <div className="mt-3 border-t pt-3">
        <div className="mb-1 flex items-center justify-between text-[11px]">
          <span className="font-medium uppercase tracking-wide text-muted-foreground">Առաջընթաց</span>
          <span className="tabular-nums font-medium text-primary">{overallPercent}%</span>
        </div>
        <div className="h-1.5 overflow-hidden rounded-full bg-secondary">
          <div className="h-full rounded-full bg-primary transition-all" style={{ width: `${overallPercent}%` }} />
        </div>
        <div className="mt-1 text-[11px] tabular-nums text-muted-foreground">{completedCount} ավարտված · {remaining} մնաց</div>
      </div>
    </div>
  );
}
