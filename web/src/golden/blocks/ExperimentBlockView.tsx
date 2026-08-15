/**
 * ExperimentBlockView — a reusable, data-driven experiment.
 * It renders any investigation as one guided flow in a fixed learning sequence:
 * Question → Prediction → Setup → Observe → Analyze → Explain → Conclusion →
 * Reflection. The flow unfolds step-by-step: the learner predicts before
 * observing and observes before the explanation is revealed. Every section is
 * optional and missing ones are hidden. Predictions are recorded but never
 * judged. The scientific explanation is shown through the shared Smart Feedback
 * presenter (no custom feedback). Related concepts open the existing Context
 * Panel, milestones are reported to the Progress Engine, and generic analytics
 * are emitted. Nothing here is specific to any experiment or subject.
 */
import { useEffect, useMemo, useRef, useState } from 'react';
import { HelpCircle, Brain, FlaskConical, Eye, Search, BookOpen, CheckCircle2, MessageCircleQuestion, ChevronUp, ChevronDown, Maximize2, RotateCcw, Network } from 'lucide-react';
import type { BlockOf } from '../schema';
import { SectionLabel } from '../visual/primitives';
import { FeedbackNote } from '../activities/FeedbackNote';
import { KNOWLEDGE_ENTITIES } from '../knowledge/entities';
import { useBlockContext } from './context';

type StepKey = 'question' | 'prediction' | 'setup' | 'observations' | 'analysis' | 'explanation' | 'conclusion' | 'reflection';
interface Step { key: StepKey; label: string; Icon: typeof HelpCircle }

const STATE: Record<StepKey, string> = {
  question: 'idle', prediction: 'prediction', setup: 'idle', observations: 'observing',
  analysis: 'analyzing', explanation: 'explanation', conclusion: 'explanation', reflection: 'reflection',
};

function emit(type: string, id: string) {
  try { window.dispatchEvent(new CustomEvent('chemverse:experiment', { detail: { type, id } })); } catch { /* ignore */ }
}

export function ExperimentBlockView({ block }: { block: BlockOf<'experiment'> }) {
  const c = block.content;
  const ctx = useBlockContext();
  const ctxRef = useRef(ctx); ctxRef.current = ctx;

  const steps = useMemo<Step[]>(() => {
    const s: Step[] = [{ key: 'question', label: 'Գիտական հարց', Icon: HelpCircle }];
    if (c.prediction) s.push({ key: 'prediction', label: 'Կանխատեսում', Icon: Brain });
    if (c.setup || c.steps?.length) s.push({ key: 'setup', label: 'Փորձի կարգը', Icon: FlaskConical });
    if (c.observations?.length) s.push({ key: 'observations', label: 'Դիտարկումներ', Icon: Eye });
    if (c.analysis) s.push({ key: 'analysis', label: 'Վերլուծություն', Icon: Search });
    if (c.explanation || c.feedback) s.push({ key: 'explanation', label: 'Գիտական բացատրություն', Icon: BookOpen });
    if (c.conclusion) s.push({ key: 'conclusion', label: 'Եզրակացություն', Icon: CheckCircle2 });
    if (c.reflection?.length) s.push({ key: 'reflection', label: 'Ինքնավերլուծություն', Icon: MessageCircleQuestion });
    return s;
  }, [c]);
  const total = steps.length;

  const [revealed, setRevealed] = useState(1);
  const [prediction, setPrediction] = useState('');
  const [predicted, setPredicted] = useState(false);
  const [obsRevealed, setObsRevealed] = useState(1);
  const started = useRef(false);
  const doneRef = useRef(false);
  const emitted = useRef<Set<string>>(new Set());

  useEffect(() => {
    ctxRef.current.registerCompletable?.(block.id);
    if (!started.current) { started.current = true; emit('experiment_started', block.id); }
  }, [block.id]);

  // Per-step milestone events + completion (fires for every revealed step).
  useEffect(() => {
    for (let i = 0; i < revealed && i < total; i++) {
      const s = steps[i];
      if (s && !emitted.current.has(s.key)) {
        emitted.current.add(s.key);
        if (s.key === 'explanation') emit('explanation_opened', block.id);
        if (s.key === 'reflection') emit('reflection_completed', block.id);
      }
    }
    if (revealed >= total && !doneRef.current) {
      doneRef.current = true;
      emit('experiment_completed', block.id);
      ctxRef.current.onBlockComplete?.(block.id);
    }
  }, [revealed, total, steps, block.id]);

  const observations = c.observations ?? [];
  const revealObs = () => setObsRevealed((n) => {
    const next = Math.min(observations.length, n + 1);
    if (next >= observations.length && !emitted.current.has('obs-done')) { emitted.current.add('obs-done'); emit('observation_completed', block.id); }
    return next;
  });
  const recordPrediction = () => { setPredicted(true); emit('prediction_submitted', block.id); };

  const goNext = () => setRevealed((r) => Math.min(total, r + 1));
  const goPrev = () => setRevealed((r) => Math.max(1, r - 1));
  const expandAll = () => { setRevealed(total); if (observations.length) { setObsRevealed(observations.length); if (!emitted.current.has('obs-done')) { emitted.current.add('obs-done'); emit('observation_completed', block.id); } } };
  const restart = () => { setRevealed(1); setObsRevealed(1); setPredicted(false); setPrediction(''); emitted.current = new Set(); doneRef.current = false; };

  const isDone = revealed >= total;
  const cur = steps[revealed - 1];
  const state = isDone ? 'completed' : cur ? STATE[cur.key] : 'idle';
  const related = (c.relatedEntities ?? []).map((id) => KNOWLEDGE_ENTITIES[id]).filter((e): e is NonNullable<typeof e> => !!e);
  const btn = 'flex items-center gap-1 rounded-md border bg-card/40 px-2.5 py-1.5 text-xs font-medium text-foreground hover:bg-accent disabled:opacity-40';

  const renderBody = (key: StepKey) => {
    switch (key) {
      case 'question':
        return <p className="text-sm font-medium text-foreground">{c.question}</p>;
      case 'prediction':
        return (
          <div>
            <p className="text-sm text-foreground/90">{c.prediction?.prompt}</p>
            {predicted ? (
              <p className="mt-2 rounded-md border border-primary/30 bg-primary/5 px-2.5 py-1.5 text-sm"><span className="font-medium">Քո կանխատեսումը՝ </span>{prediction || '—'}</p>
            ) : (c.prediction?.kind === 'choice' ? (
              <div className="mt-2 space-y-1.5">
                <div className="flex flex-wrap gap-1.5">
                  {(c.prediction.options ?? []).map((o) => (
                    <button key={o} type="button" onClick={() => setPrediction(o)}
                      className={`rounded-full border px-2.5 py-1 text-xs ${prediction === o ? 'border-primary bg-primary/15 text-primary' : 'bg-secondary/40 hover:bg-secondary'}`}>{o}</button>
                  ))}
                </div>
                <button type="button" onClick={recordPrediction} disabled={!prediction}
                  className="rounded-md bg-primary px-3 py-1 text-xs font-medium text-primary-foreground hover:opacity-90 disabled:opacity-40">Գրանցել կանխատեսումը</button>
              </div>
            ) : (
              <div className="mt-2 space-y-1.5">
                <textarea value={prediction} onChange={(e) => setPrediction(e.target.value)} rows={2}
                  placeholder="Գրի՛ր քո կանխատեսումը…"
                  className="w-full rounded-md border bg-background/60 px-2.5 py-1.5 text-sm outline-none focus:border-primary" />
                <button type="button" onClick={recordPrediction} disabled={!prediction.trim()}
                  className="rounded-md bg-primary px-3 py-1 text-xs font-medium text-primary-foreground hover:opacity-90 disabled:opacity-40">Գրանցել կանխատեսումը</button>
              </div>
            ))}
          </div>
        );
      case 'setup':
        return (
          <div className="space-y-2 text-sm text-foreground/90">
            {c.setup && <p>{c.setup}</p>}
            {c.steps?.length ? (
              <ol className="list-decimal space-y-1 pl-5">{c.steps.map((st, i) => <li key={i}>{st}</li>)}</ol>
            ) : null}
          </div>
        );
      case 'observations':
        return (
          <div>
            <ol className="space-y-1.5">
              {observations.slice(0, obsRevealed).map((o, i) => (
                <li key={i} className="flex items-start gap-2 rounded-md border bg-card/40 px-2.5 py-1.5 text-sm text-foreground/90 duration-200 animate-in fade-in-0 slide-in-from-bottom-1">
                  <span className="mt-0.5 flex size-4 shrink-0 items-center justify-center rounded-full bg-primary/15 text-[10px] font-bold text-primary">{i + 1}</span>{o}
                </li>
              ))}
            </ol>
            {obsRevealed < observations.length && (
              <button type="button" onClick={revealObs} className={`mt-2 ${btn}`}>
                <Eye className="size-3.5 text-primary" /> Հաջորդ դիտարկումը ({obsRevealed}/{observations.length})
              </button>
            )}
          </div>
        );
      case 'analysis':
        return <p className="rounded-md border-l-2 border-primary bg-card/40 px-3 py-2 text-sm text-foreground/90">{c.analysis}</p>;
      case 'explanation':
        return <FeedbackNote tone="info" headline="Գիտական բացատրություն" feedback={{ explanation: c.explanation ?? c.feedback?.explanation, learningTip: c.feedback?.learningTip }} />;
      case 'conclusion':
        return <p className="rounded-md border border-emerald-500/30 bg-emerald-500/[0.06] px-3 py-2 text-sm text-foreground/90"><span className="font-medium">Եզրակացություն՝ </span>{c.conclusion}</p>;
      case 'reflection':
        return (
          <ul className="space-y-1.5">
            {(c.reflection ?? []).map((r, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-foreground/90"><MessageCircleQuestion className="mt-0.5 size-4 shrink-0 text-primary" />{r}</li>
            ))}
          </ul>
        );
    }
  };

  return (
    <section
      data-experiment-state={state}
      className="overflow-hidden rounded-lg border bg-card/40 p-3"
      aria-label={`Փորձ՝ ${c.title}`}
      onClick={(e) => e.stopPropagation()}
      onKeyDown={(e) => e.stopPropagation()}
    >
      {/* header */}
      <div className="flex items-start gap-3">
        <span className="grid size-10 shrink-0 place-items-center rounded-full bg-primary/10 text-primary"><FlaskConical className="size-5" /></span>
        <div className="min-w-0">
          <SectionLabel>Փորձ</SectionLabel>
          <div className="text-base font-semibold text-foreground">{c.title}</div>
          {c.objective && <div className="text-xs text-muted-foreground">Նպատակ՝ {c.objective}</div>}
        </div>
        <span className="ml-auto text-[11px] tabular-nums text-muted-foreground">{Math.min(revealed, total)}/{total}</span>
      </div>

      {/* steps */}
      <ol className="mt-3 space-y-2">
        {steps.slice(0, revealed).map((step) => (
          <li key={step.key} className="rounded-md border bg-card/40 px-3 py-2 duration-200 animate-in fade-in-0 slide-in-from-bottom-1">
            <SectionLabel className="flex items-center gap-1.5"><step.Icon className="size-3.5 text-primary" />{step.label}</SectionLabel>
            <div className="mt-1">{renderBody(step.key)}</div>
          </li>
        ))}
      </ol>

      {/* related concepts → Context Panel */}
      {related.length > 0 && (
        <div className="mt-3">
          <SectionLabel className="flex items-center gap-1.5"><Network className="size-3.5 text-primary" />Կապակցված հասկացություններ</SectionLabel>
          <div className="mt-1 flex flex-wrap gap-1.5">
            {related.map((re) => (
              <button key={re.id} type="button" onClick={() => ctx.onSelectEntity?.(re.id)}
                className="rounded-full border bg-secondary/40 px-2.5 py-1 text-xs hover:bg-secondary">{re.name}</button>
            ))}
          </div>
        </div>
      )}

      {/* navigation — never locks the lesson */}
      <div className="mt-3 flex flex-wrap items-center gap-2">
        <button type="button" className={btn} onClick={goPrev} disabled={revealed <= 1}><ChevronUp className="size-3.5" /> Նախորդ</button>
        <button type="button" className={btn} onClick={goNext} disabled={isDone}>Հաջորդ <ChevronDown className="size-3.5" /></button>
        <span className="ml-auto flex items-center gap-2">
          <button type="button" className={btn} onClick={restart}><RotateCcw className="size-3.5" /> Վերսկսել</button>
          {!isDone && <button type="button" className={btn} onClick={expandAll}><Maximize2 className="size-3.5" /> Բացել բոլորը</button>}
        </span>
      </div>
    </section>
  );
}
