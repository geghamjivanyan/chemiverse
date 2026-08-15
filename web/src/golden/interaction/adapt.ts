/**
 * Adapts a legacy Activity into a generic Interaction so that existing lessons —
 * authored with the older `activity` field — render through the same Interaction
 * Engine as everything else. No lesson data has to change.
 */
import type { Activity, Interaction, InteractionType } from '../schema';

const TYPE_MAP: Record<Activity['type'], InteractionType> = {
  multiple_choice: 'multiple_choice',
  true_false: 'true_false',
  match: 'matching',
  label_diagram: 'diagram_labeling',
};

export function activityToInteraction(a: Activity): Interaction {
  return {
    id: a.id,
    type: TYPE_MAP[a.type],
    prompt: (a.config as { prompt?: string }).prompt,
    config: a.config as Record<string, unknown>,
    correctAnswers: a.correctAnswers,
    feedback: a.feedback,
  };
}
