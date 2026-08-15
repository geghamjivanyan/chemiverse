/**
 * FeedbackNote — a thin compatibility shim over the Smart Feedback Engine, kept so
 * existing call sites (e.g. the Experiment's explanation) can present feedback with
 * a simple tone. It builds a FeedbackModel and delegates to SmartFeedback — it
 * implements no feedback logic of its own.
 */
import type { ActivityFeedback } from '../schema';
import { SmartFeedback } from '../feedback/SmartFeedback';
import type { FeedbackType } from '../feedback/types';

export type FeedbackTone = 'correct' | 'incorrect' | 'info';

const TYPE: Record<FeedbackTone, FeedbackType> = { correct: 'correct', incorrect: 'incorrect', info: 'explain' };

export function FeedbackNote({ id = 'feedback', tone, feedback, headline }: { id?: string; tone: FeedbackTone; feedback?: ActivityFeedback; headline?: string }) {
  return (
    <SmartFeedback
      id={id}
      type={TYPE[tone]}
      title={headline}
      explanation={feedback?.explanation}
      reasoning={tone !== 'incorrect' ? feedback?.learningTip : undefined}
      hint={tone === 'incorrect' ? feedback?.commonMistake : undefined}
    />
  );
}
