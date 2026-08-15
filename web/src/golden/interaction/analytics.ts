/**
 * Interaction analytics — generic, reusable events emitted by every interaction
 * through the shared lifecycle. Interaction-specific events may be emitted too by
 * passing any `type` string.
 */
export type InteractionEventType =
  | 'interaction_started' | 'interaction_answered' | 'interaction_completed' | 'interaction_reset'
  | 'interaction_retry' | 'interaction_revealed' | 'interaction_skipped' | 'interaction_abandoned';

export function emitInteraction(type: string, id: string, extra?: Record<string, unknown>) {
  try { window.dispatchEvent(new CustomEvent('chemverse:interaction', { detail: { type, id, ...extra } })); } catch { /* ignore */ }
}
