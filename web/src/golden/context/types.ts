/**
 * Context Panel v2 — shared types. The panel is a single, constant shell whose
 * content is chosen entirely by `context.type` (registry lookup). A Context is a
 * lightweight descriptor: a type, an optional ref (entity/block id) and optional
 * inline data. Nothing here is lesson- or subject-specific.
 */
import type { ReactNode } from 'react';
import type { Block, Concept } from '../schema';
import type { AiContext } from '../ai/context';

export type ContextType =
  | 'knowledge_card' | 'scientist_story' | 'image_explorer' | 'interactive_diagram' | 'experiment'
  | 'definition' | 'formula' | 'keyword' | 'fact' | 'timeline' | 'reflection' | 'ai_context' | 'related_concepts';

export interface Context {
  type: ContextType;
  ref?: string;
  data?: unknown;
}

export type PanelLifecycle = 'closed' | 'opening' | 'active' | 'loading' | 'ready' | 'error' | 'closing';

/** Shared, read-only data every context view can draw on. */
export interface ContextData {
  concepts: Concept[];
  blocks: Block[];
  aiContext: AiContext;
}

export interface ContextViewProps {
  ctx: Context;
  data: ContextData;
  /** Open a related context in place (keeps the panel open, pushes history). */
  openRelated: (ctx: Context) => void;
  /** Jump the lesson to a concept (does not change the panel). */
  navigateToConcept: (conceptId: string) => void;
}

export type ContextTitle = { badge: string; title: string; body?: ReactNode };
