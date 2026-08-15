/**
 * Review Engine — shared types. A review session is generated dynamically from
 * lesson state: it holds only lightweight REFERENCES into the existing lesson
 * (block / interaction / entity / screen ids), never copies of lesson data.
 * Nothing here is lesson- or subject-specific.
 */
import type { Lesson } from '../schema';
import type { Screen } from '../screen/model';
import type { ActivityResult } from '../concept/progress';

export type ReviewMode =
  | 'mistakes' | 'incorrect_answers' | 'incomplete_screens' | 'keywords' | 'definitions'
  | 'scientist_stories' | 'experiments' | 'diagrams' | 'images' | 'knowledge_cards'
  | 'reflections' | 'all_exercises';

export type ReviewItemKind = 'interaction' | 'block' | 'entity' | 'screen';

export interface ReviewItem {
  id: string;
  kind: ReviewItemKind;
  ref: string;         // id into the lesson (block / interaction / entity / screen)
  title: string;
  screenId?: string;
  conceptId?: string;
}

export interface ReviewSession {
  mode: ReviewMode;
  items: ReviewItem[];
}

export type ReviewLifecycle = 'idle' | 'preparing' | 'active' | 'paused' | 'completed';

/** The read-only lesson state the engine builds sessions from. */
export interface ReviewState {
  lesson: Lesson;
  screens: Screen[];
  results: Record<string, ActivityResult>;
  completedScreens: Set<string>;
}
