/**
 * FeedbackFrame — the shared structure every feedback renders inside. It owns the
 * common layout (title, message, explanation, optional hint / scientific reasoning
 * / related concept), the shared lifecycle (hidden → visible → expanded →
 * action_selected → resolved → closed), analytics, and the shared Action System.
 * Feedback components supply ONLY presentation (tone, icon, default title). Empty
 * sections are hidden automatically.
 */
import { useEffect, useRef, useState } from 'react';
import { Lightbulb, ChevronDown, X } from 'lucide-react';
import { FeedbackActions } from './actions';
import { emitFeedback } from './analytics';
import type { FeedbackAction, FeedbackLifecycle, FeedbackModel } from './types';

export type FeedbackTone = 'success' | 'error' | 'warning' | 'info';

const TONE: Record<FeedbackTone, { container: string; head: string }> = {
  success: { container: 'border-emerald-500/40 bg-emerald-500/10', head: 'text-emerald-600' },
  error: { container: 'border-red-500/40 bg-red-500/10', head: 'text-red-600' },
  warning: { container: 'border-amber-500/40 bg-amber-500/10', head: 'text-amber-600' },
  info: { container: 'border-primary/30 bg-primary/10', head: 'text-primary' },
};

export function FeedbackFrame({ id, tone, Icon, title, model }: {
  id: string; tone: FeedbackTone; Icon: typeof Lightbulb; title: string; model: FeedbackModel;
}) {
  const t = TONE[tone];
  const [phase, setPhase] = useState<FeedbackLifecycle>('visible');
  const [expanded, setExpanded] = useState(false);
  const shown = useRef(false);
  useEffect(() => { if (!shown.current) { shown.current = true; emitFeedback('feedback_shown', id); } }, [id]);

  const hasMore = !!(model.hint || model.reasoning);
  const expand = () => {
    setExpanded(true);
    if (phase === 'visible') setPhase('expanded');
    emitFeedback('explanation_opened', id);
    if (model.hint) emitFeedback('hint_used', id);
  };
  const close = () => { setPhase('closed'); emitFeedback('feedback_closed', id); model.onClose?.(); };

  const actions: FeedbackAction[] = [...(model.actions ?? [])];
  if (model.relatedEntityId && !actions.some((a) => a.kind === 'open_card')) {
    actions.push({ kind: 'open_card', entityId: model.relatedEntityId });
  }

  return (
    <div data-feedback-lifecycle={phase} className={`rounded-md border p-2.5 duration-300 animate-in fade-in-0 motion-reduce:animate-none ${t.container}`} role="status" aria-live="polite">
      <div className={`flex items-center gap-1.5 text-sm font-semibold ${t.head}`}>
        <Icon className="size-4" />{model.title ?? title}
        {model.onClose && <button type="button" onClick={close} aria-label="Փակել" className="ml-auto rounded p-0.5 text-muted-foreground hover:bg-black/5"><X className="size-3.5" /></button>}
      </div>

      {model.message && <p className="mt-1.5 text-xs text-foreground/80">{model.message}</p>}
      {model.explanation && <p className="mt-1.5 text-xs text-foreground/80">{model.explanation}</p>}
      {model.revealed && model.revealNode && <div className="mt-2">{model.revealNode}</div>}

      {hasMore && !expanded && (
        <button type="button" onClick={expand} className="mt-1.5 flex items-center gap-1 text-xs font-medium text-primary hover:underline">
          <ChevronDown className="size-3.5" /> Ցույց տալ ավելին
        </button>
      )}
      {hasMore && expanded && (
        <div className="mt-1.5 space-y-1.5">
          {model.reasoning && (
            <p className="flex items-start gap-1.5 text-xs text-muted-foreground">
              <Lightbulb className="mt-0.5 size-3.5 shrink-0 text-amber-500" /><span><span className="font-medium text-foreground/80">Հիշի՛ր՝ </span>{model.reasoning}</span>
            </p>
          )}
          {model.hint && (
            <p className="flex items-start gap-1.5 text-xs text-muted-foreground">
              <Lightbulb className="mt-0.5 size-3.5 shrink-0 text-amber-500" /><span><span className="font-medium text-foreground/80">Ակնարկ՝ </span>{model.hint}</span>
            </p>
          )}
        </div>
      )}

      <FeedbackActions id={id} actions={actions} onResolve={() => setPhase('resolved')} />
    </div>
  );
}
