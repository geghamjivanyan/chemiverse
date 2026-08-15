/**
 * GoldenLessonReader — the generic, data-driven Lesson Renderer.
 * Pipeline: Lesson → Screens → Blocks → Interactions → Context.
 * It knows nothing about chemistry or any specific lesson: everything on screen
 * comes from the Lesson JSON. Its only job is to COMPOSE existing engines — the
 * Progress Engine, the Screen Navigation Engine, the ScreenRenderer, the
 * Interaction + Feedback engines, and the Context Panel (one panel whose content
 * is chosen by context.type). No lesson content is hardcoded here.
 */
import { useCallback, useEffect, useMemo, useRef } from 'react';
import { Sparkles, ChevronUp, ChevronDown } from 'lucide-react';
import type { Lesson, DiagramHotspot } from './schema';
import { lessonToScreens } from './screen/model';
import { ScreenRenderer } from './screen/ScreenRenderer';
import { useScreenNavigation } from './screen/useScreenNavigation';
import { useProgress } from './screen/useProgress';
import { ScreenSidebar } from './screen/ScreenSidebar';
import { LessonSummary, type SummaryAction } from './summary/LessonSummary';
import { buildLessonSummary } from './summary/build';
import { ReviewMode } from './review/ReviewMode';
import { useReview } from './review/useReview';
import type { ReviewMode as ReviewModeId, ReviewState } from './review/types';
import { DiagramSelectionContext } from './diagram/selection';
import { buildAiContext } from './ai/context';
import { useContextPanel } from './context/useContextPanel';
import { ContextPanel } from './context/ContextPanel';
import { blockContext } from './context/views';
import type { Context, ContextData } from './context/types';
import { LessonErrorBoundary } from './LessonErrorBoundary';

const BLOCK_CTX = new Set(['keyword', 'definition', 'formula', 'fact']);

export function GoldenLessonReader(props: { lesson: Lesson; onNextLesson?: () => void }) {
  return (
    <LessonErrorBoundary>
      <GoldenLessonReaderImpl {...props} />
    </LessonErrorBoundary>
  );
}

function GoldenLessonReaderImpl({ lesson, onNextLesson }: { lesson: Lesson; onNextLesson?: () => void }) {
  const { metadata, concepts } = lesson;
  const screens = useMemo(() => lessonToScreens(lesson), [lesson]);
  const progress = useProgress(lesson.id, screens);
  const nav = useScreenNavigation(lesson.id, screens, progress.markViewed);
  const allBlocks = useMemo(() => concepts.flatMap((c) => c.steps.flatMap((s) => s.blocks)), [concepts]);

  const screensByConcept = useMemo(() => {
    const map = new Map<string, string[]>();
    for (const s of screens) map.set(s.conceptId, [...(map.get(s.conceptId) ?? []), s.id]);
    return map;
  }, [screens]);
  const completedConcepts = useMemo(() => {
    const m: Record<string, boolean> = {};
    screensByConcept.forEach((ids, cid) => { m[cid] = ids.every((id) => progress.completed.has(id)); });
    return m;
  }, [progress.completed, screensByConcept]);
  const activeConceptId = screens.find((s) => s.id === nav.activeId)?.conceptId ?? screens[0]?.conceptId ?? null;

  const navigateToConcept = useCallback((conceptId: string) => {
    const start = screens.find((s) => s.conceptId === conceptId && s.isConceptStart);
    if (start) nav.scrollTo(start.id);
  }, [screens, nav]);

  // Bring the completion screen into view once the lesson is complete.
  const completeRef = useRef<HTMLDivElement>(null);
  const scrolledComplete = useRef(false);
  useEffect(() => {
    if (progress.lessonComplete && !scrolledComplete.current) {
      scrolledComplete.current = true;
      window.setTimeout(() => completeRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 120);
    }
  }, [progress.lessonComplete]);

  // The Context Panel: one navigation history of contexts, opened from any trigger.
  const firstBlockId = allBlocks[0]?.id;
  const initial = useMemo<Context | undefined>(() => {
    const first = allBlocks.find((b) => b.companion) ?? allBlocks[0];
    return first ? blockContext(first) : undefined;
  }, [firstBlockId]); // compute once from the (stable) first block
  const panel = useContextPanel(initial);
  const openCtx = panel.open;

  const selectBlock = useCallback((id: string) => { const b = allBlocks.find((x) => x.id === id); if (b) openCtx(blockContext(b)); }, [allBlocks, openCtx]);
  const selectEntity = useCallback((entityId: string) => openCtx({ type: 'knowledge_card', ref: entityId }), [openCtx]);
  const onSelectHotspot = useCallback((h: DiagramHotspot) => openCtx({ type: 'interactive_diagram', data: h }), [openCtx]);

  const cur = panel.current;
  const selectedHotspotId = cur && (cur.type === 'interactive_diagram' || cur.type === 'image_explorer') ? (cur.data as { id?: string }).id ?? null : null;
  const selectedId = useMemo(() => {
    if (!cur) return null;
    if (cur.ref && BLOCK_CTX.has(cur.type)) return cur.ref;
    if (cur.type === 'knowledge_card') return allBlocks.find((b) => b.type === 'keyword' && b.content.entityId === cur.ref)?.id ?? null;
    return null;
  }, [cur, allBlocks]);
  const selectedBlock = allBlocks.find((b) => b.id === selectedId) ?? null;

  const openEntity = useCallback((entityId: string) => selectEntity(entityId), [selectEntity]);

  // Review + Lesson Summary (shown on completion). One review controller is shared
  // between the summary's recommendations and the Review Mode surface below it.
  const reviewState = useMemo<ReviewState>(() => ({ lesson, screens, results: progress.interactions, completedScreens: progress.completed }), [lesson, screens, progress.interactions, progress.completed]);
  const review = useReview(reviewState);
  const reviewRef = useRef<HTMLDivElement>(null);
  const startRef = useRef(Date.now());
  const scrollToReview = useCallback(() => reviewRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }), []);
  const startReview = useCallback((mode: ReviewModeId) => { review.start(mode); scrollToReview(); }, [review, scrollToReview]);

  const summaryData = useMemo(() => buildLessonSummary({
    lesson, screens, results: progress.interactions, completedScreens: progress.completed,
    progressPercent: progress.overallPercent, completedScreenCount: progress.completedCount, totalScreens: progress.totalScreens,
    timeSpentMinutes: Math.round((Date.now() - startRef.current) / 60000),
  }), [lesson, screens, progress.interactions, progress.completed, progress.overallPercent, progress.completedCount, progress.totalScreens]);

  const summaryActions = useMemo<SummaryAction[]>(() => {
    const a: SummaryAction[] = [];
    if (summaryData.commonMistakes.length > 0) a.push({ label: 'Կրկնել սխալները', kind: 'review_mistakes', onSelect: () => startReview('mistakes') });
    a.push({ label: 'Վերանայել դասը', kind: 'review', onSelect: scrollToReview });
    if (onNextLesson) a.push({ label: 'Շարունակել ուսումը', kind: 'continue', onSelect: onNextLesson });
    a.push({ label: 'Վերադառնալ դասերին', kind: 'back', onSelect: () => { try { window.history.back(); } catch { /* ignore */ } } });
    return a;
  }, [summaryData.commonMistakes.length, startReview, scrollToReview, onNextLesson]);

  const aiContext = useMemo(
    () => buildAiContext({ lesson, currentConceptId: activeConceptId, selectedBlock, completed: completedConcepts, activityResults: progress.interactions }),
    [lesson, activeConceptId, selectedBlock, completedConcepts, progress.interactions],
  );
  const contextData = useMemo<ContextData>(() => ({ concepts, blocks: allBlocks, aiContext }), [concepts, allBlocks, aiContext]);

  return (
    <DiagramSelectionContext.Provider value={{ selectedHotspotId, onSelectHotspot }}>
      <div className="golden-light flex h-full min-h-0 bg-background text-foreground">
      <aside className="hidden w-60 shrink-0 overflow-hidden border-r bg-secondary/50 lg:flex">
        <ScreenSidebar lessonTitle={metadata.title} screens={screens} activeId={nav.activeId}
          screenState={progress.screenState} completedCount={progress.completedCount}
          totalScreens={progress.totalScreens} overallPercent={progress.overallPercent} onSelect={nav.scrollTo} />
      </aside>

      <div className="min-h-0 flex-1 overflow-auto">
        <article className="mx-auto max-w-2xl space-y-8 px-5 py-8 md:px-6">
          <header className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <h1 className="text-3xl font-bold tracking-tight text-foreground">{metadata.title}</h1>
              <p className="mt-1 text-sm text-muted-foreground">
                {metadata.subject}
                {metadata.grade ? ` · ${metadata.grade}` : ''}
                {metadata.estimatedMinutes ? ` · ~${metadata.estimatedMinutes} րոպե` : ''}
              </p>
            </div>
            <div className="flex shrink-0 items-center gap-1.5">
              <button type="button" onClick={nav.previous} aria-label="Նախորդ քայլ"
                className="flex size-8 items-center justify-center rounded-md border bg-card/40 text-foreground hover:bg-accent">
                <ChevronUp className="size-4" />
              </button>
              <button type="button" onClick={nav.next} aria-label="Հաջորդ քայլ"
                className="flex size-8 items-center justify-center rounded-md border bg-card/40 text-foreground hover:bg-accent">
                <ChevronDown className="size-4" />
              </button>
              <button type="button" onClick={() => openCtx({ type: 'ai_context' })}
                className="flex items-center gap-1.5 rounded-md border bg-card/40 px-2.5 py-1.5 text-xs font-medium text-foreground hover:bg-accent">
                <Sparkles className="size-3.5 text-primary" /> Հարցնել AI
              </button>
            </div>
          </header>

          <ScreenRenderer
            screens={screens}
            lesson={lesson}
            activeId={nav.activeId}
            register={nav.register}
            markCompleted={progress.markCompleted}
            selectedId={selectedId}
            onSelect={selectBlock}
            onSelectEntity={selectEntity}
            onActivityResult={(_conceptId, activityId, result) => progress.recordInteraction(activityId, result)}
          />

          {progress.lessonComplete && (
            <div ref={completeRef}>
              <LessonSummary data={summaryData} actions={summaryActions} onStartReview={startReview} onOpenConcept={navigateToConcept} />
              <div ref={reviewRef} className="mt-6">
                <ReviewMode controller={review} lesson={lesson} screens={screens} results={progress.interactions}
                  completedScreens={progress.completed} onOpenEntity={openEntity} onNavigateConcept={navigateToConcept} />
              </div>
            </div>
          )}
        </article>
      </div>

      <aside className="hidden w-80 shrink-0 overflow-hidden border-l bg-secondary/50 lg:block">
        <ContextPanel controller={panel} data={contextData} navigateToConcept={navigateToConcept} />
      </aside>
      </div>
    </DiagramSelectionContext.Provider>
  );
}
