/**
 * Smart Feedback Engine — shared types. Feedback is fully generic and data-driven:
 * the engine resolves a `FeedbackType` to a component via the registry and renders
 * a shared structure (title / message / explanation / hint / reasoning / related
 * concept / actions). Nothing here is lesson- or subject-specific.
 */
import type { ReactNode } from 'react';

export type FeedbackType =
  | 'correct' | 'incorrect' | 'partially_correct' | 'hint' | 'retry' | 'reveal_answer'
  | 'explain' | 'encouragement' | 'reflection' | 'completion' | 'review_reminder' | 'celebration';

export type FeedbackActionKind =
  | 'continue' | 'retry' | 'reveal' | 'explain' | 'open_card' | 'review' | 'next' | 'close';

export interface FeedbackAction {
  kind: FeedbackActionKind;
  label?: string;
  onSelect?: () => void;
  entityId?: string;   // for 'open_card'
}

/** The single lifecycle shared by every feedback, regardless of type. */
export type FeedbackLifecycle = 'hidden' | 'visible' | 'expanded' | 'action_selected' | 'resolved' | 'closed';

export interface FeedbackModel {
  title?: string;
  message?: string;
  explanation?: string;
  hint?: string;
  reasoning?: string;         // optional scientific reasoning
  relatedEntityId?: string;   // optional Knowledge Card
  actions?: FeedbackAction[];
  revealed?: boolean;
  revealNode?: ReactNode;
  onClose?: () => void;
}
