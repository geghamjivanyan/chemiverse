/**
 * ScreenRenderer — the data-driven, screen-based Lesson Renderer.
 * Pipeline: Lesson → Screens → Blocks → Interactions.
 * It iterates screens and, for each, renders a Screen Container (header +
 * delegated Block Renderer + delegated Activity Renderer). It knows nothing
 * about chemistry, scientists, atoms or experiments — only screens. Every screen
 * is always visible; nothing is locked or hidden. Block/interaction rendering is
 * delegated to the existing registries (no duplicated rendering logic).
 *
 * Navigation (active / visited) comes from the Screen Navigation Engine: each
 * screen registers its node and reflects the engine's state. Screen completion
 * is reported to the engine; activity results still flow to the Lesson Flow so
 * the completion screen and review keep working.
 */
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Target, CheckCircle2 } from 'lucide-react';
import type { ActivityResult, ConceptProgressApi } from '../concept/progress';
import { ConceptProgressContext } from '../concept/progress';
import { BlockRenderer } from '../blocks/BlockRenderer';
import { BlockRenderContext } from '../blocks/context';
import { InteractionRenderer } from '../interaction/InteractionRenderer';
import { V } from '../visual/tokens';
import { SectionLabel } from '../visual/primitives';
import type { Block, Lesson } from '../schema';
import type { Screen, ScreenLifecycle } from './model';

/** Fires `onSeen` once, when the element first scrolls into view. */
function useSeenOnce(onSeen: () => void) {
  const ref = useRef<HTMLDivElement>(null);
  const done = useRef(false);
  const cb = useRef(onSeen);
  cb.current = onSeen;
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver((entries) => {
      if (!done.current && entries.some((e) => e.isIntersecting)) {
        done.current = true;
        cb.current();
        io.disconnect();
      }
    }, { threshold: 0 });
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return ref;
}

/** A selectable block that reports when it is first seen. Rendering is delegated. */
function SeenBlock({ block, index, selected, onSeen, onSelect }: {
  block: Block; index: number; selected: boolean;
  onSeen: (index: number) => void; onSelect: (id: string) => void;
}) {
  const ref = useSeenOnce(() => onSeen(index));
  return (
    <div
      ref={ref}
      role="button"
      tabIndex={0}
      aria-pressed={selected}
      onClick={() => onSelect(block.id)}
      onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onSelect(block.id); } }}
      className={`cursor-pointer rounded-lg p-1 outline-none transition ${
        selected ? 'bg-accent/40 ring-1 ring-primary/50' : 'hover:bg-accent/20 focus-visible:bg-accent/20'
      }`}
    >
      <BlockRenderer block={block} />
    </div>
  );
}

const StepChip = ({ n }: { n: number }) => (
  <span className="grid size-5 shrink-0 place-items-center rounded-full bg-primary/15 text-[11px] font-semibold text-primary">{n}</span>
);

/** One screen: concept header (on concept start) + blocks + optional interaction. */
function ScreenView({ screen, lesson, active, register, markCompleted, selectedId, onSelect, onSelectEntity, onActivityResult }: {
  screen: Screen;
  lesson: Lesson;
  active: boolean;
  register: (screenId: string, node: HTMLDivElement | null) => void;
  markCompleted: (screenId: string) => void;
  selectedId: string | null;
  onSelect: (id: string) => void;
  onSelectEntity: (entityId: string) => void;
  onActivityResult: (conceptId: string, activityId: string, result: ActivityResult) => void;
}) {
  const [maxSeen, setMaxSeen] = useState(-1);
  const [doneIds, setDoneIds] = useState<Set<string>>(new Set());
  const see = useCallback((i: number) => setMaxSeen((m) => (i > m ? i : m)), []);

  const onResultRef = useRef(onActivityResult);
  onResultRef.current = onActivityResult;
  const api = useMemo<ConceptProgressApi>(
    () => ({ markActivityDone: (id, result) => { setDoneIds((s) => (s.has(id) ? s : new Set(s).add(id))); onResultRef.current(screen.conceptId, id, result); } }),
    [screen.conceptId],
  );

  // Completable content blocks (e.g. a scientist story) gate the screen too.
  const [completable, setCompletable] = useState<Set<string>>(new Set());
  const [blockDone, setBlockDone] = useState<Set<string>>(new Set());
  const registerCompletable = useCallback((bid: string) => setCompletable((s) => (s.has(bid) ? s : new Set(s).add(bid))), []);
  const onBlockComplete = useCallback((bid: string) => setBlockDone((s) => (s.has(bid) ? s : new Set(s).add(bid))), []);
  const contentGate = completable.size === 0 || [...completable].every((id) => blockDone.has(id));

  const hasInteraction = screen.interactions.length > 0;
  const allInteractionsDone = hasInteraction && screen.interactions.every((x) => doneIds.has(x.id));
  const contentViewed = maxSeen >= screen.blocks.length - 1;
  const complete = (hasInteraction ? allInteractionsDone : contentViewed) && contentGate;
  const started = maxSeen >= 0;
  const inProgress = active || started;
  const lifecycle: ScreenLifecycle = complete ? 'completed' : active ? 'active' : inProgress ? 'visited' : 'idle';

  const reported = useRef(false);
  useEffect(() => {
    if (complete && !reported.current) { reported.current = true; markCompleted(screen.id); }
  }, [complete, screen.id, markCompleted]);

  const status = complete
    ? <span className="flex items-center gap-1 text-emerald-600"><CheckCircle2 className="size-3.5" /> Ավարտված</span>
    : inProgress
      ? <span className="text-primary">Ընթացքի մեջ</span>
      : <span className="text-muted-foreground">Չսկսված</span>;

  return (
    <ConceptProgressContext.Provider value={api}>
      <div
        ref={(node) => register(screen.id, node)}
        data-screen-id={screen.id}
        data-screen-type={screen.type}
        data-lifecycle={lifecycle}
        className={`${V.card} scroll-mt-4 overflow-hidden p-4`}
      >
        {screen.isConceptStart && (
          <div className="mb-3">
            <SectionLabel>Հասկացություն {screen.conceptIndex + 1}</SectionLabel>
            <h2 className="text-lg font-semibold text-foreground">{screen.conceptTitle}</h2>
            {screen.conceptGoal && (
              <div className="mt-2 flex gap-2 rounded-md border border-primary/30 bg-primary/5 px-3 py-2 text-sm">
                <Target className="mt-0.5 size-4 shrink-0 text-primary" />
                <span><span className="font-medium">Նպատակ՝ </span>{screen.conceptGoal}</span>
              </div>
            )}
          </div>
        )}

        <div className={`mb-2 flex items-center gap-2 ${V.sectionLabel}`}>
          <StepChip n={screen.stepIndex + 1} /> Քայլ {screen.stepIndex + 1}{screen.title ? ` · ${screen.title}` : ''}
          <span className="ml-auto normal-case">{status}</span>
        </div>

        <BlockRenderContext.Provider value={{ lesson, screen: { id: screen.id, type: screen.type }, onSelectEntity, registerCompletable, onBlockComplete }}>
          <div className="space-y-3">
            {screen.blocks.map((block, i) => (
              <SeenBlock key={block.id} block={block} index={i} selected={block.id === selectedId} onSeen={see} onSelect={onSelect} />
            ))}
          </div>
        </BlockRenderContext.Provider>

        {screen.interactions.map((interaction) => (
          <div key={interaction.id} className="mt-3"><InteractionRenderer interaction={interaction} /></div>
        ))}
      </div>
    </ConceptProgressContext.Provider>
  );
}

export function ScreenRenderer({ screens, lesson, activeId, register, markCompleted, selectedId, onSelect, onSelectEntity, onActivityResult }: {
  screens: Screen[];
  lesson: Lesson;
  activeId: string | null;
  register: (screenId: string, node: HTMLDivElement | null) => void;
  markCompleted: (screenId: string) => void;
  selectedId: string | null;
  onSelect: (id: string) => void;
  onSelectEntity: (entityId: string) => void;
  onActivityResult: (conceptId: string, activityId: string, result: ActivityResult) => void;
}) {
  return (
    <div className="space-y-6">
      {screens.map((screen) => (
        <ScreenView
          key={screen.id}
          screen={screen}
          lesson={lesson}
          active={activeId === screen.id}
          register={register}
          markCompleted={markCompleted}
          selectedId={selectedId}
          onSelect={onSelect}
          onSelectEntity={onSelectEntity}
          onActivityResult={onActivityResult}
        />
      ))}
    </div>
  );
}
