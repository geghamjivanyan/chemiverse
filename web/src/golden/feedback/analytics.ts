/**
 * Feedback analytics — generic, reusable events emitted by the shared feedback
 * lifecycle and action system. Interaction-specific events may be emitted too.
 */
export type FeedbackEventType =
  | 'feedback_shown' | 'feedback_closed' | 'hint_used' | 'retry_clicked' | 'reveal_clicked'
  | 'explanation_opened' | 'continue_clicked' | 'knowledge_card_opened' | 'review_clicked' | 'next_clicked';

export function emitFeedback(type: string, id: string, extra?: Record<string, unknown>) {
  try { window.dispatchEvent(new CustomEvent('chemverse:feedback', { detail: { type, id, ...extra } })); } catch { /* ignore */ }
}
