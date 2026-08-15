/**
 * SmartFeedback — the Smart Feedback Engine's entry point. It resolves a feedback
 * to its component using ONLY `type` (registry lookup) and renders it through the
 * shared frame. This is the single path through which ALL learner feedback in the
 * lesson is produced; no interaction or component renders feedback on its own.
 */
import { memo } from 'react';
import { FEEDBACK_REGISTRY } from './registry';
import { ExplainFeedback } from './components';
import type { FeedbackModel, FeedbackType } from './types';

function SmartFeedbackImpl({ id, type, ...model }: { id: string; type: FeedbackType } & FeedbackModel) {
  const View = FEEDBACK_REGISTRY[type] ?? ExplainFeedback;
  return <View id={id} model={model} />;
}

export const SmartFeedback = memo(SmartFeedbackImpl);
