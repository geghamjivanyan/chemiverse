/**
 * AI Context Engine.
 * Assembles the FOCUSED context an assistant receives while a student learns:
 *   Lesson (metadata + concept outline) + Current Concept (full) + Selected Block
 *   + Student History.
 * It deliberately does NOT include the whole book — other concepts appear only
 * as an outline (title + status), never their full content. Pure and serialisable.
 */
import type { Activity, Block, Lesson } from '../schema';

export type ConceptStatus = 'completed' | 'current' | 'available' | 'locked';

export interface StudentHistory {
  overallPercent: number;
  completedConcepts: string[];
  remainingConcepts: number;
  activities: { prompt: string; correct: boolean }[];
}

export interface AiContext {
  scope: string;
  lesson: { id: string; title: string; subject: string; grade?: string; objectives?: string[] };
  conceptOutline: { id: string; title: string; status: ConceptStatus }[];
  currentConcept: { id: string; title: string; goal?: string; content: string[] } | null;
  selectedBlock: { id: string; type: string; summary: string } | null;
  studentHistory: StudentHistory;
}

/** One-line, model-readable summary of a block's teaching content. */
export function blockSummary(block: Block): string {
  switch (block.type) {
    case 'heading': return `# ${block.content.text}`;
    case 'text': return block.content.text;
    case 'definition': return `Սահմանում — ${block.content.term}՝ ${block.content.definition}`;
    case 'keyword': return `Բանալի բառ — ${block.content.term}${block.content.gloss ? `՝ ${block.content.gloss}` : ''}`;
    case 'note': return `Նշում՝ ${block.content.text}`;
    case 'fact': return `Փաստ՝ ${block.content.text}`;
    case 'formula': return `Բանաձև՝ ${block.content.formula}${block.content.caption ? ` (${block.content.caption})` : ''}`;
    case 'diagram': return `Դիագրամ (${block.content.diagram})${block.content.caption ? `՝ ${block.content.caption}` : ''}`;
    case 'image': return `Պատկեր՝ ${block.content.title ?? block.content.altText}`;
    case 'question': return `Հարց՝ ${block.content.prompt}`;
    case 'quiz': return `Թեստ՝ ${block.content.title ?? 'հարցեր'}`;
    case 'scientistStory': return `Գիտնական՝ ${block.content.scientist.name} — ${block.content.discovery}`;
    case 'experiment': return `Փորձ՝ ${block.content.title} — ${block.content.question}`;
    case 'divider': return '';
  }
}

const activitySummary = (a: Activity) => `Առաջադրանք (${a.type})՝ ${a.config.prompt}`;

export function buildAiContext(input: {
  lesson: Lesson;
  currentConceptId: string | null;
  selectedBlock: Block | null;
  completed: Record<string, boolean>;
  activityResults: Record<string, { correct: boolean; attempts: number }>;
}): AiContext {
  const { lesson, currentConceptId, selectedBlock, completed, activityResults } = input;
  const concepts = lesson.concepts;
  const total = concepts.length;
  const completedCount = concepts.filter((c) => completed[c.id]).length;
  const frontier = concepts.findIndex((c) => !completed[c.id]);

  const statusOf = (i: number, c: typeof concepts[number]): ConceptStatus => {
    if (completed[c.id]) return 'completed';
    const unlocked = i === 0 || !!completed[concepts[i - 1]!.id];
    if (!unlocked) return 'locked';
    return i === frontier ? 'current' : 'available';
  };

  const current = concepts.find((c) => c.id === currentConceptId) ?? null;
  const allActivities = concepts.flatMap((c) => c.steps.flatMap((s) => (s.activity ? [s.activity] : [])));
  const activities = Object.entries(activityResults).map(([id, r]) => ({
    prompt: allActivities.find((a) => a.id === id)?.config.prompt ?? id,
    correct: r.correct,
  }));

  return {
    scope: 'Օգնականին տրվում է միայն ընթացիկ հասկացությունը (ամբողջական), ընտրված բլոկը և աշակերտի պատմությունը՝ ոչ ամբողջ գիրքը։ Մյուս հասկացությունները երևում են միայն որպես ուրվագիծ։',
    lesson: {
      id: lesson.id,
      title: lesson.metadata.title,
      subject: lesson.metadata.subject,
      grade: lesson.metadata.grade,
      objectives: lesson.metadata.objectives,
    },
    conceptOutline: concepts.map((c, i) => ({ id: c.id, title: c.metadata.title, status: statusOf(i, c) })),
    currentConcept: current
      ? {
          id: current.id,
          title: current.metadata.title,
          goal: current.goal,
          content: current.steps.flatMap((s) => [
            s.title ? `Step: ${s.title}` : '',
            ...s.blocks.map(blockSummary),
            ...(s.activity ? [activitySummary(s.activity)] : []),
          ]).filter(Boolean),
        }
      : null,
    selectedBlock: selectedBlock
      ? { id: selectedBlock.id, type: selectedBlock.type, summary: blockSummary(selectedBlock) }
      : null,
    studentHistory: {
      overallPercent: total ? Math.round((completedCount / total) * 100) : 0,
      completedConcepts: concepts.filter((c) => completed[c.id]).map((c) => c.metadata.title),
      remainingConcepts: total - completedCount,
      activities,
    },
  };
}
