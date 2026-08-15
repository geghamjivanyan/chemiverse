import type { BlockType, Confidence, Lesson, LearningBlock } from './model';
import { BOOK_TEXT } from '../books/search';
import { ruleParser } from './parser/engine';
import type { TextbookConfig } from './parser/types';
import { CHEMISTRY_7_CONFIG } from './parser/configs/chemistry-7';
import { PHYSICS_7_CONFIG } from './parser/configs/physics-7';

// ЕДИНЫЙ источник уроков/блоков — результат ПАРСЕРА реального текста учебника.
// Парсер правиловый (см. parser/), позже заменяется AI-парсером с той же сигнатурой — без правок UI/модели.
// Книги, открываемые в Reader2: id ридера → конфиг учебника.
export const READER2_CONFIGS: Record<string, TextbookConfig> = {
  'chemistry-7.2': CHEMISTRY_7_CONFIG,
  'physics-7': PHYSICS_7_CONFIG,
};

const parsedCache = new Map<string, Lesson[]>();
function parsedFor(readerId: string): Lesson[] {
  let p = parsedCache.get(readerId);
  if (!p) {
    const cfg = READER2_CONFIGS[readerId] ?? CHEMISTRY_7_CONFIG;
    p = ruleParser({ pages: BOOK_TEXT[cfg.bookId] ?? [] }, cfg);
    parsedCache.set(readerId, p);
  }
  return p;
}

// Изменяемое состояние блока (персистентность). Бэкенда нет — localStorage.
export interface BlockState { completed?: boolean; favorite?: boolean; note?: string; confidence?: Confidence }
export type ProgressState = Record<string, BlockState>;

const KEY = (bookId: string) => `learning:${bookId}`;
export function loadState(bookId: string): ProgressState {
  try { return JSON.parse(localStorage.getItem(KEY(bookId)) || '{}'); } catch { return {}; }
}
export const saveState = (bookId: string, s: ProgressState) => localStorage.setItem(KEY(bookId), JSON.stringify(s));

// Уроки с гидрированными блоками (модель + сохранённое состояние).
export function getLessons(state: ProgressState, readerId = 'chemistry-7.2'): Lesson[] {
  return parsedFor(readerId).map((l) => ({
    ...l,
    learningBlocks: l.learningBlocks.map((b): LearningBlock => ({
      ...b,
      completed: !!state[b.id]?.completed,
      favorite: !!state[b.id]?.favorite,
      note: state[b.id]?.note,
      confidence: state[b.id]?.confidence,
    })),
  }));
}

export const AUTO_TYPES = new Set<BlockType>(['reading', 'keyword']);

// ——— селекторы (всё из Learning Blocks) ———
export const allBlocks = (lessons: Lesson[]): LearningBlock[] => lessons.flatMap((l) => l.learningBlocks);
export const totalBlocks = (lessons: Lesson[]) => allBlocks(lessons).length;
export const completedCount = (lessons: Lesson[]) => allBlocks(lessons).filter((b) => b.completed).length;
export const favoritesCount = (lessons: Lesson[]) => allBlocks(lessons).filter((b) => b.favorite).length;
export const overallPercent = (lessons: Lesson[]) => { const t = totalBlocks(lessons); return t ? Math.round((completedCount(lessons) / t) * 100) : 0; };
export const lessonTotal = (l: Lesson) => l.learningBlocks.length;
export const lessonDone = (l: Lesson) => l.learningBlocks.filter((b) => b.completed).length;
export const blockById = (lessons: Lesson[], id: string): LearningBlock | null => allBlocks(lessons).find((b) => b.id === id) ?? null;
export function firstIncomplete(lessons: Lesson[]): LearningBlock | null {
  for (const l of lessons) for (const b of l.learningBlocks) if (!b.completed) return b;
  return null;
}
// id reading-блоков на странице (из распарсенных данных) — для авто-завершения
export const readingIdsOnPage = (page: number, readerId = 'chemistry-7.2'): string[] =>
  parsedFor(readerId).flatMap((l) => l.learningBlocks).filter((b) => b.type === 'reading' && b.page === page).map((b) => b.id);

// ——— study planner: главы, план обучения, соседние блоки ———
export const lessonPercent = (l: Lesson) => { const t = lessonTotal(l); return t ? Math.round((lessonDone(l) / t) * 100) : 0; };

export interface ChapterView { chapter: string; lessons: Lesson[]; done: number; total: number; pct: number }
export function chapters(lessons: Lesson[]): ChapterView[] {
  const order: string[] = [];
  const map = new Map<string, Lesson[]>();
  for (const l of lessons) { if (!map.has(l.chapter)) { map.set(l.chapter, []); order.push(l.chapter); } map.get(l.chapter)!.push(l); }
  return order.map((chapter) => {
    const ls = map.get(chapter)!;
    const bl = ls.flatMap((l) => l.learningBlocks);
    const done = bl.filter((b) => b.completed).length;
    return { chapter, lessons: ls, done, total: bl.length, pct: bl.length ? Math.round((done / bl.length) * 100) : 0 };
  });
}

// План обучения урока: задачи = группы блоков по типу (генерируется из блоков).
const TASK_ORDER: BlockType[] = ['reading', 'definition', 'law', 'keyword', 'think', 'reflect', 'recall', 'laboratory', 'question', 'additional_material'];
export interface StudyTask { type: BlockType; total: number; done: number; firstIncomplete: LearningBlock | null }
export function studyPlan(l: Lesson): StudyTask[] {
  const map = new Map<BlockType, LearningBlock[]>();
  for (const b of l.learningBlocks) { const a = map.get(b.type) ?? []; a.push(b); map.set(b.type, a); }
  return TASK_ORDER.filter((t) => map.has(t)).map((type) => {
    const arr = map.get(type)!;
    return { type, total: arr.length, done: arr.filter((b) => b.completed).length, firstIncomplete: arr.find((b) => !b.completed) ?? null };
  });
}

export const lessonOf = (lessons: Lesson[], blockId: string): Lesson | null => lessons.find((l) => l.learningBlocks.some((b) => b.id === blockId)) ?? null;
export function adjacent(lessons: Lesson[], blockId: string): { prev: LearningBlock | null; next: LearningBlock | null } {
  const flat = allBlocks(lessons);
  const i = flat.findIndex((b) => b.id === blockId);
  return { prev: i > 0 ? flat[i - 1]! : null, next: i >= 0 && i < flat.length - 1 ? flat[i + 1]! : null };
}

// «Continue position» — последний активный блок (persist отдельно).
const AKEY = (bookId: string) => `learning:${bookId}:active`;
export const loadActive = (bookId: string): string | null => { try { return localStorage.getItem(AKEY(bookId)); } catch { return null; } };
export const saveActive = (bookId: string, id: string | null) => { try { if (id) localStorage.setItem(AKEY(bookId), id); else localStorage.removeItem(AKEY(bookId)); } catch { /* ignore */ } };

// ——— завершённость (только из блоков) ———
export const lessonComplete = (l: Lesson) => l.learningBlocks.length > 0 && l.learningBlocks.every((b) => b.completed);
export const chapterComplete = (c: ChapterView) => c.lessons.length > 0 && c.lessons.every(lessonComplete);

// ——— Needs Review: confidence низкий/средний ИЛИ не завершён ———
export const needsReview = (b: LearningBlock) => !b.completed || b.confidence === 'low' || b.confidence === 'mid';
export const reviewList = (lessons: Lesson[]): LearningBlock[] => allBlocks(lessons).filter(needsReview);

// ——— статистика урока ———
export interface LessonStats {
  pct: number; completed: number; remaining: number; total: number;
  favorites: number; notes: number;
  byType: { type: BlockType; done: number; total: number }[];
}
export function lessonStats(l: Lesson): LessonStats {
  const bl = l.learningBlocks;
  const completed = bl.filter((b) => b.completed).length;
  const map = new Map<BlockType, { done: number; total: number }>();
  for (const b of bl) { const e = map.get(b.type) ?? { done: 0, total: 0 }; e.total++; if (b.completed) e.done++; map.set(b.type, e); }
  return {
    pct: bl.length ? Math.round((completed / bl.length) * 100) : 0,
    completed, remaining: bl.length - completed, total: bl.length,
    favorites: bl.filter((b) => b.favorite).length,
    notes: bl.filter((b) => b.note && b.note.trim()).length,
    byType: [...map.entries()].map(([type, v]) => ({ type, ...v })),
  };
}

// ——— быстрые фильтры (единый источник — блоки) ———
export type StudyFilter = 'all' | 'incomplete' | 'completed' | 'favorites' | 'review' | 'notes';
export function matchFilter(b: LearningBlock, f: StudyFilter): boolean {
  switch (f) {
    case 'incomplete': return !b.completed;
    case 'completed': return b.completed;
    case 'favorites': return b.favorite;
    case 'review': return needsReview(b);
    case 'notes': return !!(b.note && b.note.trim());
    default: return true;
  }
}
export const filteredBlocks = (lessons: Lesson[], f: StudyFilter): LearningBlock[] => allBlocks(lessons).filter((b) => matchFilter(b, f));
export function adjacentIn(blocks: LearningBlock[], id: string): { prev: LearningBlock | null; next: LearningBlock | null } {
  const i = blocks.findIndex((b) => b.id === id);
  return { prev: i > 0 ? blocks[i - 1]! : null, next: i >= 0 && i < blocks.length - 1 ? blocks[i + 1]! : null };
}
