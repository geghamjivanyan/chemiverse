// История обучения (frontend-only). НЕ новая контент-модель — только события,
// ссылающиеся на id из Lesson/LearningBlock/KnowledgeEntity.
export type ActivityKind = 'view' | 'complete' | 'entity' | 'note' | 'favorite';
export interface ActivityEvent { kind: ActivityKind; refId: string; refType: 'block' | 'entity'; label?: string; ts: number }

const KEY = (bookId: string) => `activity:${bookId}`;

export function loadActivity(bookId: string): ActivityEvent[] {
  try { return JSON.parse(localStorage.getItem(KEY(bookId)) || '[]'); } catch { return []; }
}

export function logEvent(bookId: string, kind: ActivityKind, refId: string, refType: 'block' | 'entity', label?: string): ActivityEvent[] {
  const list = loadActivity(bookId);
  const last = list[0];
  const now = Date.now();
  if (last && last.kind === kind && last.refId === refId) { last.ts = now; if (label) last.label = label; }
  else list.unshift({ kind, refId, refType, label, ts: now });
  const trimmed = list.slice(0, 200);
  try { localStorage.setItem(KEY(bookId), JSON.stringify(trimmed)); } catch { /* ignore */ }
  return trimmed;
}

export const recent = (list: ActivityEvent[], kind: ActivityKind | undefined, n = 6): ActivityEvent[] =>
  (kind ? list.filter((e) => e.kind === kind) : list).slice(0, n);

export function relTime(ts: number): string {
  const s = Math.floor((Date.now() - ts) / 1000);
  if (s < 45) return 'Just now';
  if (s < 3600) return `${Math.floor(s / 60)} min ago`;
  if (s < 86400) return `${Math.floor(s / 3600)} h ago`;
  const d = Math.floor(s / 86400);
  if (d === 1) return 'Yesterday';
  return `${d} days ago`;
}

const dayKey = (ts: number) => { const d = new Date(ts); return `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`; };

export interface Streak { current: number; longest: number; lastDate: number | null }
export function streak(list: ActivityEvent[]): Streak {
  const set = new Set(list.filter((e) => e.kind === 'complete').map((e) => dayKey(e.ts)));
  const today = new Date();
  let current = 0;
  for (let i = 0; i < 400; i++) {
    const d = new Date(today); d.setDate(today.getDate() - i);
    if (set.has(dayKey(d.getTime()))) current++;
    else if (i === 0) continue; // сегодня ещё не занимались — считаем со вчера
    else break;
  }
  const ms = [...set].map((k) => { const [y, m, dd] = k.split('-').map(Number); return new Date(y!, m!, dd!).getTime(); }).sort((a, b) => a - b);
  let longest = 0, run = 0, prev: number | null = null;
  for (const t of ms) { run = prev !== null && t - prev === 86400000 ? run + 1 : 1; longest = Math.max(longest, run); prev = t; }
  return { current, longest, lastDate: ms.length ? ms[ms.length - 1]! : null };
}
