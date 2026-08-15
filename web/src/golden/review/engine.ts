/**
 * Review Engine — builds a review session dynamically from lesson state. Each mode
 * is a builder registered in REVIEW_BUILDERS: `mode → ReviewItem[]`. Builders only
 * SELECT references from the existing lesson (never copy content), so adding a new
 * review mode means writing one builder + registering it — the engine core and the
 * UI stay untouched. Fully generic and subject-agnostic.
 */
import { AlertTriangle, XCircle, CircleSlash, Brain, BookOpen, User, FlaskConical, Shapes, Image as ImageIcon, CreditCard, MessageCircleQuestion, ListChecks } from 'lucide-react';
import { KNOWLEDGE_ENTITIES } from '../knowledge/entities';
import type { Block } from '../schema';
import type { ReviewItem, ReviewMode, ReviewState } from './types';

const blockItems = (state: ReviewState, pred: (b: Block) => boolean, title: (b: Block) => string): ReviewItem[] =>
  state.screens.flatMap((s) => s.blocks.filter(pred).map((b) => ({ id: `b:${b.id}`, kind: 'block' as const, ref: b.id, title: title(b), screenId: s.id, conceptId: s.conceptId })));

const interactionItems = (state: ReviewState, pred: (id: string, type: string) => boolean): ReviewItem[] =>
  state.screens.flatMap((s) => s.interactions.filter((i) => pred(i.id, i.type)).map((i) => ({ id: `i:${i.id}`, kind: 'interaction' as const, ref: i.id, title: i.prompt ?? i.type, screenId: s.id, conceptId: s.conceptId })));

/** Every entity id referenced anywhere in a block. */
function entityIdsOf(b: Block): string[] {
  if (b.type === 'keyword') return b.content.entityId ? [b.content.entityId] : [];
  if (b.type === 'scientistStory') return [b.content.scientist.entityId, b.content.discoveryEntityId].filter((x): x is string => !!x);
  if (b.type === 'experiment') return b.content.relatedEntities ?? [];
  if (b.type === 'diagram') return (b.content.hotspots ?? []).flatMap((h) => (h.entityId ? [h.entityId] : []));
  if (b.type === 'image') return (b.content.hotspots ?? []).flatMap((h) => (h.entityId ? [h.entityId] : []));
  return [];
}

export const REVIEW_BUILDERS: Record<ReviewMode, (state: ReviewState) => ReviewItem[]> = {
  mistakes: (s) => interactionItems(s, (id) => !!s.results[id] && s.results[id]!.firstTry === false),
  incorrect_answers: (s) => interactionItems(s, (id) => !!s.results[id]?.wrongAnswer),
  incomplete_screens: (s) => s.screens.filter((sc) => !s.completedScreens.has(sc.id)).map((sc) => ({ id: `s:${sc.id}`, kind: 'screen', ref: sc.id, title: sc.title ?? `Քայլ ${sc.stepIndex + 1}`, screenId: sc.id, conceptId: sc.conceptId })),
  keywords: (s) => blockItems(s, (b) => b.type === 'keyword', (b) => (b.type === 'keyword' ? b.content.term : '')),
  definitions: (s) => blockItems(s, (b) => b.type === 'definition', (b) => (b.type === 'definition' ? b.content.term : '')),
  scientist_stories: (s) => blockItems(s, (b) => b.type === 'scientistStory', (b) => (b.type === 'scientistStory' ? b.content.scientist.name : '')),
  experiments: (s) => blockItems(s, (b) => b.type === 'experiment', (b) => (b.type === 'experiment' ? b.content.title : '')),
  diagrams: (s) => blockItems(s, (b) => b.type === 'diagram', (b) => (b.type === 'diagram' ? (b.content.caption ?? b.content.diagram) : '')),
  images: (s) => blockItems(s, (b) => b.type === 'image', (b) => (b.type === 'image' ? (b.content.title ?? b.content.altText) : '')),
  knowledge_cards: (s) => {
    const ids = [...new Set(s.screens.flatMap((sc) => sc.blocks.flatMap(entityIdsOf)))].filter((id) => KNOWLEDGE_ENTITIES[id]);
    return ids.map((id) => ({ id: `e:${id}`, kind: 'entity', ref: id, title: KNOWLEDGE_ENTITIES[id]!.name }));
  },
  reflections: (s) => [
    ...interactionItems(s, (_id, type) => type === 'reflection' || type === 'explain' || type === 'prediction'),
    ...blockItems(s, (b) => b.type === 'question', (b) => (b.type === 'question' ? b.content.prompt : '')),
  ],
  all_exercises: (s) => interactionItems(s, () => true),
};

export function buildReviewSession(mode: ReviewMode, state: ReviewState): ReviewItem[] {
  return (REVIEW_BUILDERS[mode] ?? (() => []))(state);
}

export const REVIEW_MODES: { id: ReviewMode; label: string; icon: typeof Brain }[] = [
  { id: 'mistakes', label: 'Կրկնել սխալները', icon: AlertTriangle },
  { id: 'incorrect_answers', label: 'Սխալ պատասխանները', icon: XCircle },
  { id: 'incomplete_screens', label: 'Անավարտ էկրանները', icon: CircleSlash },
  { id: 'keywords', label: 'Հիմնական հասկացությունները', icon: Brain },
  { id: 'definitions', label: 'Սահմանումները', icon: BookOpen },
  { id: 'scientist_stories', label: 'Գիտնականների պատմությունները', icon: User },
  { id: 'experiments', label: 'Փորձերը', icon: FlaskConical },
  { id: 'diagrams', label: 'Գծապատկերները', icon: Shapes },
  { id: 'images', label: 'Պատկերները', icon: ImageIcon },
  { id: 'knowledge_cards', label: 'Գիտելիքի քարտերը', icon: CreditCard },
  { id: 'reflections', label: 'Ինքնավերլուծությունները', icon: MessageCircleQuestion },
  { id: 'all_exercises', label: 'Բոլոր առաջադրանքները', icon: ListChecks },
];
