/**
 * Context Panel analytics — generic, reusable events. Opening the panel never
 * affects lesson progress; it only notifies analytics.
 */
export type ContextEventType =
  | 'context_opened' | 'context_closed' | 'context_changed' | 'related_context_opened' | 'context_back' | 'context_forward';

export function emitContext(type: string, ctxType: string, ref?: string) {
  try { window.dispatchEvent(new CustomEvent('chemverse:context', { detail: { type, ctxType, ref } })); } catch { /* ignore */ }
}
