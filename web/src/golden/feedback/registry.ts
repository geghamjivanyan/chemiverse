/**
 * Feedback Registry — maps a `feedback.type` to its component. Rendering is decided
 * ONLY by this map (no switch statements). Adding a feedback type requires exactly
 * two things: write the component, add one line here. The engine stays untouched.
 */
import type { FC } from 'react';
import type { FeedbackModel, FeedbackType } from './types';
import {
  CorrectFeedback, IncorrectFeedback, PartiallyCorrectFeedback, HintFeedback, RetryFeedback,
  RevealAnswerFeedback, ExplainFeedback, EncouragementFeedback, ReflectionFeedback,
  CompletionFeedback, ReviewReminderFeedback, CelebrationFeedback,
} from './components';

export const FEEDBACK_REGISTRY: Record<FeedbackType, FC<{ id: string; model: FeedbackModel }>> = {
  correct: CorrectFeedback,
  incorrect: IncorrectFeedback,
  partially_correct: PartiallyCorrectFeedback,
  hint: HintFeedback,
  retry: RetryFeedback,
  reveal_answer: RevealAnswerFeedback,
  explain: ExplainFeedback,
  encouragement: EncouragementFeedback,
  reflection: ReflectionFeedback,
  completion: CompletionFeedback,
  review_reminder: ReviewReminderFeedback,
  celebration: CelebrationFeedback,
};
