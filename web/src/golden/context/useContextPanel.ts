/**
 * useContextPanel — the Context Panel engine's state: a single navigation history
 * of contexts with back / forward / replace / open / openRelated / close. It is
 * lesson-agnostic and drives one constant panel whose content changes with the
 * current context. Analytics are emitted here; progress is never touched.
 */
import { useCallback, useMemo, useState } from 'react';
import { emitContext } from './analytics';
import type { Context, PanelLifecycle } from './types';

const same = (a: Context | undefined, b: Context) => !!a && a.type === b.type && a.ref === b.ref;

export interface ContextPanelController {
  current: Context | null;
  history: Context[];
  index: number;
  canBack: boolean;
  canForward: boolean;
  lifecycle: PanelLifecycle;
  open: (ctx: Context) => void;
  openRelated: (ctx: Context) => void;
  replace: (ctx: Context) => void;
  back: () => void;
  forward: () => void;
  close: () => void;
}

export function useContextPanel(initial?: Context): ContextPanelController {
  const [history, setHistory] = useState<Context[]>(initial ? [initial] : []);
  const [index, setIndex] = useState(initial ? 0 : -1);

  const current = index >= 0 ? history[index] ?? null : null;

  const push = useCallback((ctx: Context, event: 'context_opened' | 'related_context_opened') => {
    setHistory((h) => {
      const cur = index >= 0 ? h[index] : undefined;
      if (same(cur, ctx)) return h;                    // ignore re-opening the same context
      return [...h.slice(0, index + 1), ctx];
    });
    setIndex((i) => {
      const cur = index >= 0 ? history[index] : undefined;
      return same(cur, ctx) ? i : i + 1;
    });
    emitContext(event, ctx.type, ctx.ref);
    emitContext('context_changed', ctx.type, ctx.ref);
  }, [index, history]);

  const open = useCallback((ctx: Context) => push(ctx, 'context_opened'), [push]);
  const openRelated = useCallback((ctx: Context) => push(ctx, 'related_context_opened'), [push]);

  const replace = useCallback((ctx: Context) => {
    setHistory((h) => { if (index < 0) return [ctx]; const n = [...h]; n[index] = ctx; return n; });
    if (index < 0) setIndex(0);
    emitContext('context_changed', ctx.type, ctx.ref);
  }, [index]);

  const back = useCallback(() => {
    setIndex((i) => {
      if (i <= 0) return i;
      const c = history[i - 1];
      emitContext('context_back', c?.type ?? '', c?.ref);
      emitContext('context_changed', c?.type ?? '', c?.ref);
      return i - 1;
    });
  }, [history]);

  const forward = useCallback(() => {
    setIndex((i) => {
      if (i >= history.length - 1) return i;
      const c = history[i + 1];
      emitContext('context_forward', c?.type ?? '', c?.ref);
      emitContext('context_changed', c?.type ?? '', c?.ref);
      return i + 1;
    });
  }, [history]);

  const close = useCallback(() => { setIndex(-1); if (current) emitContext('context_closed', current.type, current.ref); }, [current]);

  const lifecycle: PanelLifecycle = current ? 'ready' : 'closed';

  return useMemo(() => ({
    current, history, index,
    canBack: index > 0, canForward: index < history.length - 1, lifecycle,
    open, openRelated, replace, back, forward, close,
  }), [current, history, index, lifecycle, open, openRelated, replace, back, forward, close]);
}
