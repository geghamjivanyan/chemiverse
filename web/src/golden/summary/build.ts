/**
 * buildLessonSummary — turns lesson state into the data the LessonSummary renders.
 * It only SELECTS and COUNTS from existing lesson + progress data (it never
 * computes lesson progress itself — the numbers are handed in), and it reuses the
 * Review Engine to derive review recommendations. Fully generic and subject-agnostic.
 */
import type { Lesson } from '../schema';
import type { Screen } from '../screen/model';
import type { ActivityResult } from '../concept/progress';
import type { InteractionType } from '../schema';
import { buildReviewSession, REVIEW_MODES } from '../review/engine';
import type { ReviewMode, ReviewState } from '../review/types';

export interface LessonSummaryData {
  title: string;
  conceptCount: number;
  progressPercent: number;
  stats: { completedScreens: number; totalScreens: number; completedInteractions: number; totalInteractions: number; firstTry: number; timeSpentMinutes?: number };
  whatYouLearned: string[];
  keyConcepts: { id: string; title: string }[];
  skills: string[];
  strengths: string[];
  topicsToReview: { id: string; title: string }[];
  commonMistakes: { id: string; prompt: string; wrong?: string; explanation?: string }[];
  recommendations: { mode: ReviewMode; label: string; count: number }[];
}

const SKILL_LABEL: Partial<Record<InteractionType, string>> = {
  multiple_choice: 'Ընտրություն', true_false: 'Ճիշտ/Սխալ', matching: 'Համապատասխանեցում', connect: 'Կապակցում',
  sorting: 'Դասավորում', sequence: 'Հաջորդականություն', timeline: 'Ժամանակագրություն', classification: 'Դասակարգում',
  compare: 'Համեմատում', build: 'Կառուցում', diagram_labeling: 'Դիագրամի նշում', fill_diagram: 'Դիագրամի լրացում',
  prediction: 'Կանխատեսում', reflection: 'Ինքնավերլուծություն', explain: 'Բացատրություն', observation: 'Դիտարկում',
  discovery: 'Հայտնագործում', reveal: 'Բացահայտում', hotspot: 'Ակտիվ կետեր', image_exploration: 'Պատկերի ուսումնասիրում', simulation: 'Սիմուլյացիա',
};

const RECOMMEND_MODES: ReviewMode[] = ['mistakes', 'keywords', 'definitions', 'experiments', 'diagrams', 'scientist_stories', 'reflections'];

export function buildLessonSummary(input: {
  lesson: Lesson;
  screens: Screen[];
  results: Record<string, ActivityResult>;
  completedScreens: Set<string>;
  progressPercent: number;
  completedScreenCount: number;
  totalScreens: number;
  timeSpentMinutes?: number;
}): LessonSummaryData {
  const { lesson, screens, results, completedScreens, progressPercent, completedScreenCount, totalScreens, timeSpentMinutes } = input;

  const interactions = screens.flatMap((s) => s.interactions.map((i) => ({ i, conceptId: s.conceptId })));
  const totalInteractions = interactions.length;
  const completedInteractions = interactions.filter(({ i }) => results[i.id]?.correct).length;
  const firstTry = interactions.filter(({ i }) => results[i.id]?.firstTry).length;
  const mistakes = interactions.filter(({ i }) => results[i.id] && results[i.id]!.firstTry === false);

  const conceptTitle = (id: string) => lesson.concepts.find((c) => c.id === id)?.metadata.title ?? id;
  const mistakeConceptIds = [...new Set(mistakes.map((m) => m.conceptId))];

  const skills = [...new Set(interactions.filter(({ i }) => results[i.id]).map(({ i }) => SKILL_LABEL[i.type] ?? i.type))];

  const strengths: string[] = [];
  if (firstTry > 0) strengths.push(`${firstTry}/${totalInteractions} առաջադրանք՝ առաջին փորձից ճիշտ`);
  const cleanConcepts = lesson.concepts.filter((c) => !mistakeConceptIds.includes(c.id));
  if (cleanConcepts.length > 0 && mistakes.length > 0) strengths.push(`Ամուր տիրապետում՝ ${cleanConcepts.map((c) => c.metadata.title).join(', ')}`);

  const reviewState: ReviewState = { lesson, screens, results, completedScreens };
  const recommendations = RECOMMEND_MODES
    .map((mode) => ({ mode, label: REVIEW_MODES.find((m) => m.id === mode)?.label ?? mode, count: buildReviewSession(mode, reviewState).length }))
    .filter((r) => r.count > 0);

  return {
    title: lesson.metadata.title,
    conceptCount: lesson.concepts.length,
    progressPercent,
    stats: { completedScreens: completedScreenCount, totalScreens, completedInteractions, totalInteractions, firstTry, timeSpentMinutes },
    whatYouLearned: lesson.metadata.objectives ?? [],
    keyConcepts: lesson.concepts.map((c) => ({ id: c.id, title: c.metadata.title })),
    skills,
    strengths,
    topicsToReview: mistakeConceptIds.map((id) => ({ id, title: conceptTitle(id) })),
    commonMistakes: mistakes.map(({ i }) => ({ id: i.id, prompt: i.prompt ?? i.type, wrong: results[i.id]?.wrongAnswer, explanation: i.feedback?.explanation })),
    recommendations,
  };
}
