/**
 * Screen model — the screen-based view of a lesson.
 * A Screen is one complete learning step: a small group of blocks plus an
 * optional interaction. Screens are derived from the lesson data (concepts →
 * steps) by a pure adapter, so no lesson content is rewritten and the renderer
 * stays generic. Nothing here knows about chemistry — only screens.
 */
import type { Block, Concept, Interaction, Lesson } from '../schema';
import { activityToInteraction } from '../interaction/adapt';

/** Lifecycle of a screen as the learner moves through the lesson. */
export type ScreenLifecycle = 'idle' | 'active' | 'visited' | 'completed';

export interface Screen {
  id: string;
  type: string;
  title?: string;
  /** The concept this screen belongs to (used for progress reporting only). */
  conceptId: string;
  conceptIndex: number;
  conceptTitle: string;
  stepIndex: number;
  /** True for the first screen of its concept (shows the concept header/goal). */
  isConceptStart: boolean;
  conceptGoal?: string;
  blocks: Block[];
  interactions: Interaction[];
}

/**
 * Derive the ordered screen sequence from a lesson. Pure and data-driven:
 * every learning step becomes one screen, tagged with its concept for progress.
 */
export function lessonToScreens(lesson: Lesson): Screen[] {
  const screens: Screen[] = [];
  lesson.concepts.forEach((concept: Concept, conceptIndex) => {
    concept.steps.forEach((step, stepIndex) => {
      screens.push({
        id: step.id,
        type: 'learning-step',
        title: step.title,
        conceptId: concept.id,
        conceptIndex,
        conceptTitle: concept.metadata.title,
        stepIndex,
        isConceptStart: stepIndex === 0,
        conceptGoal: stepIndex === 0 ? (concept.goal ?? concept.metadata.summary) : undefined,
        blocks: step.blocks,
        interactions: [
          ...(step.activity ? [activityToInteraction(step.activity)] : []),
          ...(step.interactions ?? []),
        ],
      });
    });
  });
  return screens;
}
