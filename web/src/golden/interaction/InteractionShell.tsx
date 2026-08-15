/**
 * InteractionShell — the shared frame every interaction renders inside. It owns
 * the common chrome (label, state chip) and the input-phase controls (submit /
 * continue / reset). All post-answer feedback and its actions (retry / reveal /
 * continue) are produced by the Smart Feedback Engine — the shell never renders
 * feedback itself. Individual interactions provide only their input UI as children.
 */
import type { ReactNode } from 'react';
import { RotateCcw, ArrowRight } from 'lucide-react';
import type { ActivityFeedback } from '../schema';
import { SmartFeedback } from '../feedback/SmartFeedback';
import type { FeedbackAction } from '../feedback/types';
import { V } from '../visual/tokens';
import type { InteractionController } from './useInteraction';

const CHIP: Record<string, { label: string; cls: string }> = {
  ready: { label: 'Չսկսված', cls: 'text-muted-foreground' },
  answered: { label: 'Սխալ', cls: 'text-red-600' },
  feedback: { label: 'Ստուգված', cls: 'text-primary' },
  completed: { label: 'Ավարտված', cls: 'text-emerald-600' },
};

export function InteractionShell({ id, label, icon, prompt, graded, canSubmit, canComplete, controller, feedback, reveal, children }: {
  id: string;
  label: string;
  icon: ReactNode;
  prompt?: string;
  graded: boolean;
  canSubmit?: boolean;
  canComplete?: boolean;
  controller: InteractionController;
  feedback?: ActivityFeedback;
  reveal?: ReactNode;
  children: ReactNode;
}) {
  const { phase, lifecycle, correct, attempts, revealed, submit, retry, reset, reveal: doReveal, finish } = controller;
  const chip = CHIP[lifecycle] ?? { label: 'Չսկսված', cls: 'text-muted-foreground' };
  const border = correct === true ? 'border-emerald-500/40' : correct === false && phase === 'submitted' ? 'border-red-500/40' : '';

  const feedbackVisible = graded ? phase !== 'input' : phase === 'done';
  const fbType = graded ? (correct ? 'correct' : 'incorrect') : 'completion';
  const actions: FeedbackAction[] = [];
  if (graded && phase === 'submitted' && !correct) {
    actions.push({ kind: 'retry', onSelect: retry });
    if (!revealed) actions.push({ kind: 'reveal', onSelect: doReveal });
  }
  if (graded && phase === 'submitted' && correct) actions.push({ kind: 'continue', onSelect: finish });

  return (
    <div data-interaction-state={lifecycle} className={`rounded-lg border bg-card/40 p-3 shadow-sm transition-colors ${border}`}>
      <div className={`mb-1 flex items-center gap-1.5 ${V.sectionLabel}`}>
        {icon}{label}
        <span className={`ml-auto normal-case ${chip.cls}`}>{chip.label}</span>
      </div>
      {prompt && <div className="text-sm font-medium text-foreground">{prompt}</div>}
      <div className="mt-2">{children}</div>

      {feedbackVisible && (
        <div className="mt-3">
          <SmartFeedback
            id={id}
            type={fbType}
            explanation={feedback?.explanation}
            reasoning={correct !== false ? feedback?.learningTip : undefined}
            hint={correct === false ? feedback?.commonMistake : undefined}
            revealed={revealed}
            revealNode={reveal}
            actions={actions}
          />
        </div>
      )}

      <div className="mt-3 flex flex-wrap items-center gap-2">
        {graded && phase === 'input' && (
          <button type="button" disabled={!canSubmit} onClick={submit}
            className="rounded-md bg-primary px-3 py-1.5 text-sm font-medium text-primary-foreground hover:opacity-90 disabled:opacity-40">Ստուգել</button>
        )}
        {!graded && phase !== 'done' && (
          <button type="button" disabled={canComplete === false} onClick={finish}
            className="flex items-center gap-1.5 rounded-md bg-primary px-3 py-1.5 text-sm font-medium text-primary-foreground hover:opacity-90 disabled:opacity-40">Շարունակել <ArrowRight className="size-3.5" /></button>
        )}
        {phase === 'done' && (
          <button type="button" onClick={reset} className="flex items-center gap-1 rounded-md border bg-secondary/40 px-3 py-1.5 text-sm font-medium hover:bg-secondary"><RotateCcw className="size-3.5" /> Վերսկսել</button>
        )}
        {attempts > 0 && <span className="ml-auto text-[11px] tabular-nums text-muted-foreground">Փորձեր՝ {attempts}</span>}
      </div>
    </div>
  );
}
