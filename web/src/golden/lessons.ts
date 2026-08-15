/**
 * Registry of Golden Lessons, keyed by textbook id. The renderer is generic, so
 * adding a future lesson is purely a data change: author its Lesson JSON and add
 * one entry here (plus a catalog entry) — no React code changes required.
 */
import type { Lesson } from './schema';
import { atomStructureLesson } from './atom-structure.lesson';

export const GOLDEN_LESSONS: Record<string, Lesson> = {
  'atom-structure': atomStructureLesson,
};
