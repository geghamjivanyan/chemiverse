/**
 * ScientistStoryBlockView — a reusable, data-driven scientist story.
 * It renders one scientist as a connected investigation in a fixed learning
 * sequence (Problem → Previous Model → Experiment → Observation → Discovery →
 * Limitation → Transition → Key Takeaway), unfolding step-by-step. It is fully
 * generic — it renders only the data it receives and contains no reference to any
 * specific scientist. It integrates with the Context Panel (clicking the
 * scientist or the discovery opens its Knowledge Card), the Progress Engine (it
 * registers as completable and reports completion) and emits generic analytics.
 */
import { useEffect, useMemo, useRef, useState } from 'react';
import { User, HelpCircle, History, FlaskConical, Eye, Sparkles, AlertTriangle, ArrowRight, Lightbulb, ChevronDown, ChevronUp, Maximize2, Minimize2 } from 'lucide-react';
import type { BlockOf } from '../schema';
import { SectionLabel } from '../visual/primitives';
import { useBlockContext } from './context';

type StepTone = 'neutral' | 'discovery' | 'warning' | 'tip';

interface StoryStep {
  key: string;
  label: string;
  Icon: typeof HelpCircle;
  text: string;
  tone: StepTone;
  entityId?: string;
}

const TONE: Record<StepTone, string> = {
  neutral: 'border bg-card/40',
  discovery: 'border-primary/40 bg-primary/5',
  warning: 'border-amber-500/30 bg-amber-500/[0.06]',
  tip: 'border-emerald-500/30 bg-emerald-500/[0.06]',
};

function emit(type: string, scientist: string) {
  try { window.dispatchEvent(new CustomEvent('chemverse:story', { detail: { type, scientist } })); } catch { /* ignore */ }
}

export function ScientistStoryBlockView({ block }: { block: BlockOf<'scientistStory'> }) {
  const c = block.content;
  const ctx = useBlockContext();

  const steps = useMemo<StoryStep[]>(() => {
    const list: (StoryStep | null)[] = [
      { key: 'problem', label: 'Գիտական խնդիր', Icon: HelpCircle, text: c.problem, tone: 'neutral' },
      c.previousModel ? { key: 'previousModel', label: 'Նախորդ մոդել', Icon: History, text: c.previousModel, tone: 'neutral' } : null,
      { key: 'experiment', label: 'Գիտափորձ', Icon: FlaskConical, text: c.experiment, tone: 'neutral' },
      { key: 'observation', label: 'Դիտարկում', Icon: Eye, text: c.observation, tone: 'neutral' },
      { key: 'discovery', label: 'Հայտնագործություն', Icon: Sparkles, text: c.discovery, tone: 'discovery', entityId: c.discoveryEntityId },
      c.limitation ? { key: 'limitation', label: 'Սահմանափակում', Icon: AlertTriangle, text: c.limitation, tone: 'warning' } : null,
      c.transition ? { key: 'transition', label: 'Անցում հաջորդ գիտնականին', Icon: ArrowRight, text: c.transition, tone: 'neutral' } : null,
      { key: 'takeaway', label: 'Հիմնական միտք', Icon: Lightbulb, text: c.takeaway, tone: 'tip' },
    ];
    return list.filter((s): s is StoryStep => s !== null);
  }, [c]);

  const total = steps.length;
  const [revealed, setRevealed] = useState(1);
  const startedRef = useRef(false);
  const everCompletedRef = useRef(false);

  // Register with the screen once and announce the story started.
  const mountRef = useRef({ register: ctx.registerCompletable, id: block.id, name: c.scientist.name });
  mountRef.current = { register: ctx.registerCompletable, id: block.id, name: c.scientist.name };
  useEffect(() => {
    const m = mountRef.current;
    m.register?.(m.id);
    if (!startedRef.current) { startedRef.current = true; emit('scientist_story_started', m.name); }
  }, []);

  // Report completion to the Progress Engine when every step has been revealed.
  useEffect(() => {
    if (revealed >= total && !everCompletedRef.current) {
      everCompletedRef.current = true;
      ctx.onBlockComplete?.(block.id);
      emit('scientist_story_completed', c.scientist.name);
    }
  }, [revealed, total, block.id, ctx, c.scientist.name]);

  const goNext = () => setRevealed((r) => { const n = Math.min(total, r + 1); if (n !== r) emit('scientist_story_step_changed', c.scientist.name); return n; });
  const goPrev = () => setRevealed((r) => { const n = Math.max(1, r - 1); if (n !== r) emit('scientist_story_step_changed', c.scientist.name); return n; });
  const expandAll = () => { setRevealed(total); emit('scientist_story_expanded', c.scientist.name); };
  const collapseAll = () => { setRevealed(1); emit('scientist_story_collapsed', c.scientist.name); };

  const isDone = revealed >= total;
  const state = isDone ? (everCompletedRef.current ? 'completed' : 'expanded') : everCompletedRef.current ? 'review' : revealed > 1 ? 'active' : 'idle';

  const btn = 'flex items-center gap-1 rounded-md border bg-card/40 px-2.5 py-1.5 text-xs font-medium text-foreground hover:bg-accent disabled:opacity-40';

  return (
    <section
      data-story-state={state}
      className="overflow-hidden rounded-lg border bg-card/40 p-3"
      aria-label={`Գիտնականի պատմություն՝ ${c.scientist.name}`}
      onClick={(e) => e.stopPropagation()}
      onKeyDown={(e) => e.stopPropagation()}
    >
      {/* Header — clicking the scientist opens their Knowledge Card. */}
      <div className="flex items-center gap-3">
        <span className="grid size-10 shrink-0 place-items-center rounded-full bg-primary/10 text-primary">
          {c.scientist.portrait
            ? <img src={c.scientist.portrait} alt={c.scientist.name} className="size-10 rounded-full object-cover" />
            : <User className="size-5" />}
        </span>
        <div className="min-w-0">
          <div className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground">Գիտնական</div>
          {c.scientist.entityId ? (
            <button type="button" onClick={() => ctx.onSelectEntity?.(c.scientist.entityId!)}
              className="text-base font-semibold text-primary hover:underline">
              {c.scientist.name}
            </button>
          ) : (
            <div className="text-base font-semibold text-foreground">{c.scientist.name}</div>
          )}
          {c.scientist.period && <div className="text-xs text-muted-foreground">{c.scientist.period}</div>}
        </div>
        <span className="ml-auto text-[11px] tabular-nums text-muted-foreground">{Math.min(revealed, total)}/{total}</span>
      </div>

      {/* Steps unfold one at a time. */}
      <ol className="mt-3 space-y-2">
        {steps.slice(0, revealed).map((step) => {
          const clickable = !!(step.entityId && ctx.onSelectEntity);
          return (
            <li key={step.key} className={`rounded-md border px-3 py-2 duration-200 animate-in fade-in-0 slide-in-from-bottom-1 ${TONE[step.tone]}`}>
              <SectionLabel className="flex items-center gap-1.5">
                <step.Icon className="size-3.5 text-primary" />{step.label}
              </SectionLabel>
              <p className="mt-0.5 text-sm text-foreground/90">
                {clickable ? (
                  <button type="button" onClick={() => ctx.onSelectEntity?.(step.entityId!)} className="text-left text-primary hover:underline">
                    {step.text}
                  </button>
                ) : step.text}
              </p>
            </li>
          );
        })}
      </ol>

      {/* Navigation — never locks; the whole lesson stays accessible. */}
      <div className="mt-3 flex flex-wrap items-center gap-2">
        <button type="button" className={btn} onClick={goPrev} disabled={revealed <= 1}>
          <ChevronUp className="size-3.5" /> Նախորդ
        </button>
        <button type="button" className={btn} onClick={goNext} disabled={isDone}>
          Հաջորդ <ChevronDown className="size-3.5" />
        </button>
        <span className="ml-auto flex items-center gap-2">
          {isDone ? (
            <button type="button" className={btn} onClick={collapseAll}><Minimize2 className="size-3.5" /> Ծալել</button>
          ) : (
            <button type="button" className={btn} onClick={expandAll}><Maximize2 className="size-3.5" /> Բացել բոլորը</button>
          )}
        </span>
      </div>
    </section>
  );
}
