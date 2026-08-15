import type { Lesson, LearningBlock } from './model';
import { needsReview } from './store';
import { taskLabel } from './blockTypes';
import { ENTITY_SEED } from './knowledge/entities';
import type { ActivityEvent } from './activity';

const WEEK = 7 * 86400000;

// Smart Review: незавершённые ИЛИ needs-review (низкая уверенность) ИЛИ давно не открывавшиеся завершённые
export function reviewQueue(lessons: Lesson[], activity: ActivityEvent[]): LearningBlock[] {
  const lastView = new Map<string, number>();
  for (const e of activity) if (e.kind === 'view' && e.refType === 'block' && !lastView.has(e.refId)) lastView.set(e.refId, e.ts);
  const now = Date.now();
  return lessons.flatMap((l) => l.learningBlocks).filter((b) =>
    needsReview(b) || (b.completed && lastView.has(b.id) && now - (lastView.get(b.id) ?? 0) > WEEK));
}

// Today's Goal — авто-цель из текущего прогресса (обновляется сама)
export interface DailyGoal { text: string; done: number; total: number; lesson?: Lesson; target?: LearningBlock | null }
export function todaysGoal(lessons: Lesson[]): DailyGoal {
  const cur = lessons.find((l) => l.learningBlocks.some((b) => !b.completed));
  if (!cur) return { text: 'Բոլոր դասերն ավարտված են 🎉', done: 1, total: 1 };
  const inc = cur.learningBlocks.filter((b) => !b.completed);
  if (inc.length <= 3) {
    return { text: `Ավարտել դասը՝ «${cur.title}»`, done: cur.learningBlocks.length - inc.length, total: cur.learningBlocks.length, lesson: cur, target: inc[0] ?? null };
  }
  const byType = new Map<string, number>();
  for (const b of inc) byType.set(b.type, (byType.get(b.type) ?? 0) + 1);
  const [type, count] = [...byType.entries()].sort((a, b) => b[1] - a[1])[0]!;
  const target = Math.min(count, type === 'keyword' ? 3 : type === 'question' ? 5 : 2);
  const doneType = cur.learningBlocks.filter((b) => b.type === type && b.completed).length;
  return { text: taskLabel[type as keyof typeof taskLabel](target), done: Math.min(doneType, target), total: target, lesson: cur, target: inc.find((b) => b.type === type) ?? null };
}

// Unified Search — по урокам, блокам, сущностям
export interface SearchResults { lessons: Lesson[]; blocks: LearningBlock[]; entities: { id: string; name: string; type: string }[] }
export function searchAll(lessons: Lesson[], query: string): SearchResults | null {
  const q = query.toLowerCase().trim();
  if (q.length < 2) return null;
  const all = lessons.flatMap((l) => l.learningBlocks);
  return {
    lessons: lessons.filter((l) => l.title.toLowerCase().includes(q)).slice(0, 8),
    blocks: all.filter((b) => b.type !== 'reading' && (b.title.toLowerCase().includes(q) || (b.description ?? '').toLowerCase().includes(q))).slice(0, 24),
    entities: ENTITY_SEED.filter((e) => e.name.toLowerCase().includes(q) || e.aliases.some((a) => a.toLowerCase().includes(q))).slice(0, 12)
      .map((e) => ({ id: e.id, name: e.name, type: e.type })),
  };
}
