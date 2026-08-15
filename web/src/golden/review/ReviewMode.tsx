/**
 * ReviewMode — the reusable Review Mode surface. It lets the learner pick a review
 * mode, then walks a dynamically-generated session one item at a time. Every item
 * is rendered by REUSING the existing engines (Block Renderer, Interaction Library
 * + Smart Feedback, Knowledge Cards / Context Panel) — nothing is reimplemented.
 * Review progress is tracked separately (a review-scoped ConceptProgress provider),
 * so it never changes lesson completion. Fully generic and subject-agnostic.
 */
import { useMemo } from 'react';
import { RotateCcw, ChevronLeft, ChevronRight, X, Pause, Play, ArrowRight, CreditCard, CheckCircle2 } from 'lucide-react';
import type { Lesson } from '../schema';
import type { Screen } from '../screen/model';
import type { ActivityResult, ConceptProgressApi } from '../concept/progress';
import { ConceptProgressContext } from '../concept/progress';
import { BlockRenderer } from '../blocks/BlockRenderer';
import { BlockRenderContext } from '../blocks/context';
import { InteractionRenderer } from '../interaction/InteractionRenderer';
import { KNOWLEDGE_ENTITIES } from '../knowledge/entities';
import { REVIEW_MODES, buildReviewSession } from './engine';
import type { ReviewController } from './useReview';
import type { ReviewItem, ReviewState } from './types';

export function ReviewMode({ controller, lesson, screens, results, completedScreens, onOpenEntity, onNavigateConcept }: {
  controller: ReviewController;
  lesson: Lesson;
  screens: Screen[];
  results: Record<string, ActivityResult>;
  completedScreens: Set<string>;
  onOpenEntity: (entityId: string) => void;
  onNavigateConcept: (conceptId: string) => void;
}) {
  const state: ReviewState = { lesson, screens, results, completedScreens };
  const review = controller;

  const counts = useMemo(() => Object.fromEntries(REVIEW_MODES.map((m) => [m.id, buildReviewSession(m.id, state).length])), [state]);
  const blockById = useMemo(() => new Map(screens.flatMap((s) => s.blocks.map((b) => [b.id, b] as const))), [screens]);
  const interactionById = useMemo(() => new Map(screens.flatMap((s) => s.interactions.map((i) => [i.id, i] as const))), [screens]);
  const screenById = useMemo(() => new Map(screens.map((s) => [s.id, s] as const)), [screens]);

  const goNext = () => { if (review.current) review.markDone(review.current.id); review.next(); };

  const renderItem = (item: ReviewItem) => {
    if (item.kind === 'interaction') {
      const i = interactionById.get(item.ref);
      if (!i) return null;
      const api: ConceptProgressApi = { markActivityDone: () => review.markDone(item.id) };  // review-scoped, not lesson progress
      return (
        <ConceptProgressContext.Provider value={api}>
          <BlockRenderContext.Provider value={{ lesson, onSelectEntity: onOpenEntity }}>
            <InteractionRenderer interaction={i} />
          </BlockRenderContext.Provider>
        </ConceptProgressContext.Provider>
      );
    }
    if (item.kind === 'block') {
      const b = blockById.get(item.ref);
      if (!b) return null;
      return (
        <BlockRenderContext.Provider value={{ lesson, onSelectEntity: onOpenEntity, onBlockComplete: () => review.markDone(item.id) }}>
          <BlockRenderer block={b} />
        </BlockRenderContext.Provider>
      );
    }
    if (item.kind === 'entity') {
      const e = KNOWLEDGE_ENTITIES[item.ref];
      return (
        <div className="rounded-lg border bg-card/40 p-3">
          <div className="text-sm font-semibold text-foreground">{e?.name ?? item.ref}</div>
          {e?.definition && <p className="mt-1 line-clamp-3 text-sm text-muted-foreground">{e.definition}</p>}
          <button type="button" onClick={() => { onOpenEntity(item.ref); review.markDone(item.id); }}
            className="mt-2 flex items-center gap-1.5 rounded-md bg-primary/10 px-2.5 py-1 text-xs font-medium text-primary hover:bg-primary/15">
            <CreditCard className="size-3.5" /> Բացել գիտելիքի քարտը
          </button>
        </div>
      );
    }
    // screen
    const s = screenById.get(item.ref);
    return (
      <div className="rounded-lg border bg-card/40 p-3">
        <div className="text-sm font-semibold text-foreground">{item.title}</div>
        <div className="text-xs text-muted-foreground">{s?.conceptTitle}</div>
        <button type="button" onClick={() => { if (s) onNavigateConcept(s.conceptId); review.markDone(item.id); }}
          className="mt-2 flex items-center gap-1.5 rounded-md bg-primary/10 px-2.5 py-1 text-xs font-medium text-primary hover:bg-primary/15">
          <ArrowRight className="size-3.5" /> Անցնել էկրանին
        </button>
      </div>
    );
  };

  // ─── mode selector (idle) ───
  if (review.lifecycle === 'idle') {
    return (
      <section className="space-y-4 rounded-xl border bg-card/20 p-5 shadow-sm" data-review-lifecycle="idle" aria-label="Կրկնություն">
        <div className="flex items-center gap-1.5 text-sm font-semibold text-foreground"><RotateCcw className="size-4 text-primary" /> Կրկնություն</div>
        <p className="text-xs text-muted-foreground">Ընտրի՛ր, թե ինչ վերանայել — կրկնիր միայն անհրաժեշտ մասերը։</p>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
          {REVIEW_MODES.map((m) => {
            const n = counts[m.id] ?? 0;
            const Icon = m.icon;
            return (
              <button key={m.id} type="button" disabled={n === 0} onClick={() => review.start(m.id)}
                className="flex items-center gap-2 rounded-lg border bg-card/40 p-2.5 text-left text-xs font-medium transition hover:bg-accent disabled:opacity-40">
                <Icon className="size-4 shrink-0 text-primary" />
                <span className="line-clamp-2 flex-1">{m.label}</span>
                <span className="shrink-0 tabular-nums text-muted-foreground">{n}</span>
              </button>
            );
          })}
        </div>
      </section>
    );
  }

  const modeLabel = REVIEW_MODES.find((m) => m.id === review.mode)?.label ?? '';
  const done = review.lifecycle === 'completed';

  // ─── active session ───
  return (
    <section className="space-y-3 rounded-xl border bg-card/20 p-5 shadow-sm" data-review-lifecycle={review.lifecycle} aria-label={modeLabel}>
      <div className="flex items-center gap-2">
        <RotateCcw className="size-4 text-primary" />
        <span className="flex-1 text-sm font-semibold text-foreground">{modeLabel}</span>
        <span className="tabular-nums text-xs text-muted-foreground">{review.percent}%</span>
        {review.lifecycle === 'paused'
          ? <button type="button" onClick={review.resume} aria-label="Շարունակել" className="rounded p-1 text-muted-foreground hover:bg-accent"><Play className="size-4" /></button>
          : <button type="button" onClick={review.pause} aria-label="Դադար" className="rounded p-1 text-muted-foreground hover:bg-accent"><Pause className="size-4" /></button>}
        <button type="button" onClick={review.exit} aria-label="Դուրս գալ" className="rounded p-1 text-muted-foreground hover:bg-accent"><X className="size-4" /></button>
      </div>

      {review.items.length === 0 ? (
        <p className="rounded-md border border-emerald-500/30 bg-emerald-500/[0.06] px-3 py-4 text-center text-sm text-emerald-600">Այստեղ վերանայելու բան չկա — ապրե՛ս։ 🎉</p>
      ) : done ? (
        <div className="space-y-3 text-center">
          <CheckCircle2 className="mx-auto size-8 text-emerald-600" />
          <p className="text-sm font-medium text-foreground">Կրկնությունն ավարտված է։</p>
          <button type="button" onClick={review.exit} className="rounded-md bg-primary px-3 py-1.5 text-sm font-medium text-primary-foreground hover:opacity-90">Վերջ</button>
        </div>
      ) : review.current ? (
        <>
          <div className="text-[11px] tabular-nums text-muted-foreground">{review.index + 1}/{review.items.length}</div>
          <div key={review.current.id} className="animate-in fade-in-0 slide-in-from-right-2 duration-200 motion-reduce:animate-none">
            {renderItem(review.current)}
          </div>
          <div className="flex items-center gap-2">
            <button type="button" onClick={review.prev} disabled={review.index <= 0}
              className="flex items-center gap-1 rounded-md border bg-card/40 px-3 py-1.5 text-sm font-medium hover:bg-accent disabled:opacity-40"><ChevronLeft className="size-3.5" /> Նախորդ</button>
            <button type="button" onClick={goNext}
              className="ml-auto flex items-center gap-1 rounded-md bg-primary px-3 py-1.5 text-sm font-medium text-primary-foreground hover:opacity-90">
              {review.index >= review.items.length - 1 ? 'Ավարտել' : 'Հաջորդ'} <ChevronRight className="size-3.5" />
            </button>
          </div>
        </>
      ) : null}
    </section>
  );
}
