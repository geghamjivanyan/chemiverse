/**
 * Concept progress context — lets an interactive activity report its own
 * completion up to the ConceptView that hosts it, without threading callbacks
 * through the Block/Activity registries. Optional: if no ConceptView is present,
 * `useConceptProgress()` returns null and reporting is a no-op.
 */
import { createContext, useContext } from 'react';

/** The scored outcome of an activity once the student completes it (correct). */
export interface ActivityResult {
  correct: boolean;
  attempts: number;
  firstTry: boolean;
  /** The (wrong) answer the student gave on their first attempt, if any. */
  wrongAnswer?: string;
}

export interface ConceptProgressApi {
  /** Called by an activity when the student completes it (after a correct answer). */
  markActivityDone: (activityId: string, result: ActivityResult) => void;
}

export const ConceptProgressContext = createContext<ConceptProgressApi | null>(null);

export const useConceptProgress = () => useContext(ConceptProgressContext);
