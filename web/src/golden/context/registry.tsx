/**
 * Context Registry — maps a `context.type` to its view. Resolution is by this map
 * ONLY (no switch statements). Adding a context type requires writing a view and
 * adding one line here; the panel engine stays untouched.
 */
import type { FC } from 'react';
import type { ContextType, ContextViewProps } from './types';
import { KnowledgeCardView, CompanionView, HotspotView, AiContextView, RelatedConceptsView, InfoView } from './views';

export const CONTEXT_REGISTRY: Record<ContextType, FC<ContextViewProps>> = {
  knowledge_card: KnowledgeCardView,
  keyword: CompanionView,
  definition: CompanionView,
  formula: CompanionView,
  fact: CompanionView,
  interactive_diagram: HotspotView,
  image_explorer: HotspotView,
  ai_context: AiContextView,
  related_concepts: RelatedConceptsView,
  scientist_story: InfoView,
  experiment: InfoView,
  timeline: InfoView,
  reflection: InfoView,
};
