/**
 * Shared Action System — renders a feedback's available actions as buttons. Each
 * action kind has a consistent label, icon and analytics event; 'open_card'
 * routes through the existing Context Panel (onSelectEntity). Every feedback uses
 * this — no feedback component implements its own action buttons.
 */
import { ArrowRight, RotateCcw, Eye, BookOpen, CreditCard, RefreshCw, X } from 'lucide-react';
import { useBlockContext } from '../blocks/context';
import { emitFeedback } from './analytics';
import type { FeedbackAction, FeedbackActionKind } from './types';

const META: Record<FeedbackActionKind, { label: string; Icon: typeof ArrowRight; event: string; primary?: boolean }> = {
  continue: { label: 'Շարունակել', Icon: ArrowRight, event: 'continue_clicked', primary: true },
  retry: { label: 'Կրկնել', Icon: RotateCcw, event: 'retry_clicked' },
  reveal: { label: 'Ցույց տալ պատասխանը', Icon: Eye, event: 'reveal_clicked' },
  explain: { label: 'Ցույց տալ բացատրությունը', Icon: BookOpen, event: 'explanation_opened' },
  open_card: { label: 'Բացել գիտելիքի քարտը', Icon: CreditCard, event: 'knowledge_card_opened' },
  review: { label: 'Կրկնել հասկացությունը', Icon: RefreshCw, event: 'review_clicked' },
  next: { label: 'Հաջորդ էկրան', Icon: ArrowRight, event: 'next_clicked', primary: true },
  close: { label: 'Փակել', Icon: X, event: 'feedback_closed' },
};

export function FeedbackActions({ id, actions, onResolve }: { id: string; actions: FeedbackAction[]; onResolve?: () => void }) {
  const ctx = useBlockContext();
  if (actions.length === 0) return null;
  const run = (a: FeedbackAction) => {
    const m = META[a.kind];
    emitFeedback(m.event, id);
    if (a.kind === 'open_card' && a.entityId) ctx.onSelectEntity?.(a.entityId);
    a.onSelect?.();
    onResolve?.();
  };
  return (
    <div className="mt-3 flex flex-wrap items-center gap-2">
      {actions.map((a, idx) => {
        const m = META[a.kind];
        const cls = m.primary
          ? 'flex items-center gap-1.5 rounded-md bg-primary px-3 py-1.5 text-sm font-medium text-primary-foreground hover:opacity-90'
          : 'flex items-center gap-1 rounded-md border bg-card/40 px-3 py-1.5 text-sm font-medium text-foreground hover:bg-accent';
        return (
          <button key={idx} type="button" onClick={() => run(a)} className={cls}>
            <m.Icon className="size-3.5" /> {a.label ?? m.label}
          </button>
        );
      })}
    </div>
  );
}
