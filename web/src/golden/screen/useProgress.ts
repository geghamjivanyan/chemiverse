/**
 * useProgress — the reusable, screen-based Progress Engine.
 * It is the single source of truth for learning progress: which screens are
 * viewed, which are completed, and which interactions are done. Progress is
 * derived from these states — never from scroll position. The engine is fully
 * UI-independent (UI only displays what it computes), lesson-agnostic, persisted
 * per lesson, and emits generic progress events. A screen becomes completed only
 * when its completion condition is reported — viewing alone never completes it.
 */
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import type { ActivityResult } from '../concept/progress';
import type { Screen } from './model';

export type ScreenState = 'not-started' | 'viewed' | 'in-progress' | 'completed';

export type ProgressEventType =
  | 'lesson_started' | 'screen_viewed' | 'screen_completed' | 'progress_updated' | 'lesson_completed';

export interface ProgressEvent {
  type: ProgressEventType;
  lessonId: string;
  screenId?: string;
  percent?: number;
  timestamp: number;
}

interface Persisted { viewed: string[]; completed: string[]; interactions: Record<string, ActivityResult> }

function key(lessonId: string) { return `chemverse:progress:${lessonId}`; }

function load(lessonId: string): { viewed: Set<string>; completed: Set<string>; interactions: Record<string, ActivityResult> } {
  try {
    const raw = localStorage.getItem(key(lessonId));
    if (raw) {
      const d = JSON.parse(raw) as Persisted;
      return { viewed: new Set(d.viewed ?? []), completed: new Set(d.completed ?? []), interactions: d.interactions ?? {} };
    }
  } catch { /* ignore */ }
  return { viewed: new Set(), completed: new Set(), interactions: {} };
}

export interface ProgressEngine {
  viewed: Set<string>;
  completed: Set<string>;
  interactions: Record<string, ActivityResult>;
  screenState: (id: string, activeId?: string | null) => ScreenState;
  viewedPercent: number;
  completedPercent: number;
  interactionPercent: number;
  overallPercent: number;
  completedCount: number;
  totalScreens: number;
  lessonComplete: boolean;
  markViewed: (id: string) => void;
  markCompleted: (id: string) => void;
  recordInteraction: (activityId: string, result: ActivityResult) => void;
}

export function useProgress(lessonId: string, screens: Screen[], onEvent?: (e: ProgressEvent) => void): ProgressEngine {
  const initial = useMemo(() => load(lessonId), [lessonId]);
  const [viewed, setViewed] = useState<Set<string>>(initial.viewed);
  const [completed, setCompleted] = useState<Set<string>>(initial.completed);
  const [interactions, setInteractions] = useState<Record<string, ActivityResult>>(initial.interactions);

  const onEventRef = useRef(onEvent);
  onEventRef.current = onEvent;
  const emit = useCallback((type: ProgressEventType, extra?: Partial<ProgressEvent>) => {
    const e: ProgressEvent = { type, lessonId, timestamp: Date.now(), ...extra };
    onEventRef.current?.(e);
    try { window.dispatchEvent(new CustomEvent('chemverse:progress', { detail: e })); } catch { /* ignore */ }
  }, [lessonId]);

  const total = screens.length;
  const activityIds = useMemo(() => screens.flatMap((s) => s.interactions.map((a) => a.id)), [screens]);

  const markViewed = useCallback((id: string) => {
    setViewed((v) => { if (v.has(id)) return v; emit('screen_viewed', { screenId: id }); return new Set(v).add(id); });
  }, [emit]);

  const markCompleted = useCallback((id: string) => {
    setCompleted((c) => { if (c.has(id)) return c; emit('screen_completed', { screenId: id }); return new Set(c).add(id); });
  }, [emit]);

  const recordInteraction = useCallback((activityId: string, result: ActivityResult) => {
    setInteractions((r) => (r[activityId] ? r : { ...r, [activityId]: result }));
  }, []);

  const completedInteractions = activityIds.filter((id) => interactions[id]?.correct).length;
  const viewedPercent = total ? Math.round((viewed.size / total) * 100) : 0;
  const completedPercent = total ? Math.round((completed.size / total) * 100) : 0;
  const interactionPercent = activityIds.length ? Math.round((completedInteractions / activityIds.length) * 100) : 100;
  const overallPercent = completedPercent; // learning progress = screens actually completed
  const lessonComplete = total > 0 && completed.size === total && activityIds.every((id) => interactions[id]?.correct);

  const screenState = useCallback((id: string, activeId?: string | null): ScreenState => {
    if (completed.has(id)) return 'completed';
    if (activeId === id) return 'in-progress';
    if (viewed.has(id)) return 'viewed';
    return 'not-started';
  }, [completed, viewed]);

  // Persist whenever any progress state changes.
  useEffect(() => {
    try {
      const data: Persisted = { viewed: [...viewed], completed: [...completed], interactions };
      localStorage.setItem(key(lessonId), JSON.stringify(data));
    } catch { /* ignore */ }
  }, [lessonId, viewed, completed, interactions]);

  // lesson_started once.
  const startedRef = useRef(false);
  useEffect(() => { if (!startedRef.current) { startedRef.current = true; emit('lesson_started'); } }, [emit]);

  // progress_updated whenever the overall figure changes.
  useEffect(() => { emit('progress_updated', { percent: overallPercent }); }, [overallPercent, emit]);

  // lesson_completed once.
  const completeRef = useRef(false);
  useEffect(() => { if (lessonComplete && !completeRef.current) { completeRef.current = true; emit('lesson_completed', { percent: 100 }); } }, [lessonComplete, emit]);

  return {
    viewed, completed, interactions, screenState,
    viewedPercent, completedPercent, interactionPercent, overallPercent,
    completedCount: completed.size, totalScreens: total, lessonComplete,
    markViewed, markCompleted, recordInteraction,
  };
}
