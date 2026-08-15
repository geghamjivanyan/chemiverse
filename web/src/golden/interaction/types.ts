/**
 * Interaction Library — shared types. An Interaction is a fully generic,
 * data-driven learner task. The engine renders it purely from `type` (registry
 * lookup) and passes `config`/`correctAnswers`/`feedback` to the component.
 * Nothing here is lesson- or subject-specific.
 */
export type { Interaction, InteractionType } from '../schema';

export const INTERACTION_TYPES = [
  'prediction', 'multiple_choice', 'true_false', 'sorting', 'matching', 'connect', 'sequence',
  'classification', 'compare', 'build', 'hotspot', 'image_exploration', 'diagram_labeling',
  'timeline', 'simulation', 'reflection', 'explain', 'discovery', 'observation', 'fill_diagram', 'reveal',
] as const;

/** The single lifecycle shared by every interaction, regardless of type. */
export type InteractionLifecycle = 'idle' | 'ready' | 'active' | 'answered' | 'feedback' | 'completed' | 'review';
