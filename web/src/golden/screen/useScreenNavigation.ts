/**
 * useScreenNavigation — the Screen Navigation Engine.
 * Generic and lesson-agnostic: given the screen sequence it tracks which screen
 * is active (from viewport position), and supports scroll, direct jump,
 * next/previous and deep-linking. It reports the active screen as "viewed" so the
 * Progress Engine (the source of truth for progress) can record it — navigation
 * itself owns no progress state. It never locks navigation; every screen is
 * reachable at any time. The current position is persisted for resume.
 */
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import type { Screen } from './model';

function storageKey(lessonId: string) { return `chemverse:nav:${lessonId}`; }

function loadActive(lessonId: string): string | null {
  try {
    const raw = localStorage.getItem(storageKey(lessonId));
    return raw ? ((JSON.parse(raw) as { activeId: string | null }).activeId ?? null) : null;
  } catch { return null; }
}

export interface ScreenNavigation {
  activeId: string | null;
  register: (id: string, node: HTMLElement | null) => void;
  scrollTo: (id: string) => void;
  next: () => void;
  previous: () => void;
}

export function useScreenNavigation(lessonId: string, screens: Screen[], onViewed?: (id: string) => void): ScreenNavigation {
  const saved = useMemo(() => loadActive(lessonId), [lessonId]);
  const [activeId, setActiveId] = useState<string | null>(() => saved ?? screens[0]?.id ?? null);

  const nodes = useRef<Map<string, HTMLElement>>(new Map());

  const register = useCallback((id: string, node: HTMLElement | null) => {
    if (node) nodes.current.set(id, node);
    else nodes.current.delete(id);
  }, []);

  // Active screen = the topmost screen whose top has scrolled above a reference
  // line just below the app chrome. Computed from live positions on scroll, so it
  // is robust and always matches where the reader jumps to.
  const computeActive = useCallback(() => {
    const refY = window.innerHeight * 0.18;
    let best: string | null = null;
    let bestTop = -Infinity;
    nodes.current.forEach((node, id) => {
      const top = node.getBoundingClientRect().top;
      if (top <= refY && top > bestTop) { bestTop = top; best = id; }
    });
    if (best) setActiveId(best);
  }, []);

  useEffect(() => {
    let raf = 0;
    const handler = () => { cancelAnimationFrame(raf); raf = requestAnimationFrame(computeActive); };
    document.addEventListener('scroll', handler, true);
    window.addEventListener('resize', handler);
    computeActive();
    return () => { cancelAnimationFrame(raf); document.removeEventListener('scroll', handler, true); window.removeEventListener('resize', handler); };
  }, [computeActive]);

  // Report the active screen as viewed to the Progress Engine.
  const onViewedRef = useRef(onViewed);
  onViewedRef.current = onViewed;
  useEffect(() => { if (activeId) onViewedRef.current?.(activeId); }, [activeId]);

  const scrollTo = useCallback((id: string) => {
    const node = nodes.current.get(id);
    if (!node) return;
    node.scrollIntoView({ behavior: 'smooth', block: 'start' });
    setActiveId(id);
    try { window.history.replaceState(null, '', `#${id}`); } catch { /* ignore */ }
  }, []);

  const next = useCallback(() => {
    const i = screens.findIndex((s) => s.id === activeId);
    const n = i >= 0 ? screens[i + 1] : undefined;
    if (n) scrollTo(n.id);
  }, [screens, activeId, scrollTo]);

  const previous = useCallback(() => {
    const i = screens.findIndex((s) => s.id === activeId);
    const prev = i > 0 ? screens[i - 1] : undefined;
    if (prev) scrollTo(prev.id);
  }, [screens, activeId, scrollTo]);

  // Persist the current position (for resume) per lesson.
  useEffect(() => {
    try { localStorage.setItem(storageKey(lessonId), JSON.stringify({ activeId })); } catch { /* ignore */ }
  }, [lessonId, activeId]);

  // Deep-link: on mount, jump to the screen named in the URL hash (once nodes exist).
  useEffect(() => {
    const id = decodeURIComponent(window.location.hash.replace(/^#/, ''));
    if (id && screens.some((s) => s.id === id)) {
      const t = window.setTimeout(() => scrollTo(id), 120);
      return () => window.clearTimeout(t);
    }
  }, [screens, scrollTo]);

  return { activeId, register, scrollTo, next, previous };
}
