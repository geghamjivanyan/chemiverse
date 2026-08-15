/**
 * useReview — the reusable Review Mode state: it builds a session lazily for the
 * chosen mode, tracks its own navigation and progress (separate from lesson
 * completion), manages the review lifecycle and emits analytics. Lesson progress
 * is never touched here.
 */
import { useCallback, useRef, useState } from 'react';
import { buildReviewSession } from './engine';
import type { ReviewItem, ReviewLifecycle, ReviewMode, ReviewState } from './types';

function emit(type: string, mode: string, extra?: Record<string, unknown>) {
  try { window.dispatchEvent(new CustomEvent('chemverse:review', { detail: { type, mode, ...extra } })); } catch { /* ignore */ }
}

export interface ReviewController {
  mode: ReviewMode | null;
  items: ReviewItem[];
  index: number;
  current: ReviewItem | null;
  reviewed: Set<string>;
  lifecycle: ReviewLifecycle;
  percent: number;
  start: (mode: ReviewMode) => void;
  next: () => void;
  prev: () => void;
  jumpTo: (i: number) => void;
  pause: () => void;
  resume: () => void;
  exit: () => void;
  markDone: (id: string) => void;
}

export function useReview(state: ReviewState): ReviewController {
  const stateRef = useRef(state); stateRef.current = state;
  const [mode, setMode] = useState<ReviewMode | null>(null);
  const [items, setItems] = useState<ReviewItem[]>([]);
  const [index, setIndex] = useState(0);
  const [reviewed, setReviewed] = useState<Set<string>>(new Set());
  const [lifecycle, setLifecycle] = useState<ReviewLifecycle>('idle');

  const openItem = (list: ReviewItem[], i: number, m: ReviewMode) => {
    const it = list[i];
    if (it) emit('review_item_opened', m, { itemId: it.id, index: i });
  };

  const start = useCallback((m: ReviewMode) => {
    setLifecycle('preparing');
    const list = buildReviewSession(m, stateRef.current);   // built lazily from current state
    setMode(m); setItems(list); setIndex(0); setReviewed(new Set()); setLifecycle('active');
    emit('review_started', m, { count: list.length });
    openItem(list, 0, m);
  }, []);

  const next = useCallback(() => {
    if (!mode) return;
    setIndex((i) => {
      if (i >= items.length - 1) { setLifecycle('completed'); emit('review_completed', mode, { count: items.length }); return i; }
      openItem(items, i + 1, mode);
      return i + 1;
    });
  }, [mode, items]);

  const prev = useCallback(() => {
    if (!mode) return;
    setIndex((i) => { if (i <= 0) return i; openItem(items, i - 1, mode); return i - 1; });
  }, [mode, items]);

  const jumpTo = useCallback((i: number) => {
    if (!mode || i < 0 || i >= items.length) return;
    setIndex(i); setLifecycle('active'); openItem(items, i, mode);
  }, [mode, items]);

  const pause = useCallback(() => { if (mode) { setLifecycle('paused'); emit('review_paused', mode); } }, [mode]);
  const resume = useCallback(() => { if (mode) { setLifecycle('active'); emit('review_resumed', mode); } }, [mode]);
  const exit = useCallback(() => { if (mode) emit('review_exited', mode); setLifecycle('idle'); setMode(null); setItems([]); setIndex(0); }, [mode]);

  const markDone = useCallback((id: string) => {
    setReviewed((s) => { if (s.has(id)) return s; if (mode) emit('review_item_completed', mode, { itemId: id }); return new Set(s).add(id); });
  }, [mode]);

  const current = items[index] ?? null;
  const percent = items.length ? Math.round((reviewed.size / items.length) * 100) : 0;

  return { mode, items, index, current, reviewed, lifecycle, percent, start, next, prev, jumpTo, pause, resume, exit, markDone };
}
