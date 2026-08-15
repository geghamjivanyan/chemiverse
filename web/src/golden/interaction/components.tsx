/**
 * Interaction components — one small component per interaction type, each built
 * on a handful of shared input primitives and the shared lifecycle (useInteraction
 * + InteractionShell). A component describes ONLY its own behavior (how to read an
 * answer, whether it is graded, when it can complete); everything else — chrome,
 * navigation, feedback, progress, analytics — comes from the shared infrastructure.
 * Nothing here is lesson- or subject-specific.
 */
import { useMemo, useState } from 'react';
import {
  ListChecks, ToggleLeft, Brain, ArrowUpDown, ArrowLeftRight, Link2, ListOrdered, Boxes,
  Scale, Blocks, MapPin, Image as ImageIcon, Tags, CalendarClock, SlidersHorizontal,
  MessageCircleQuestion, BookOpen, Sparkles, Eye, ChevronUp, ChevronDown,
} from 'lucide-react';
import { useBlockContext } from '../blocks/context';
import { useInteraction } from './useInteraction';
import { InteractionShell } from './InteractionShell';
import type { Interaction } from './types';

type Opt = { id: string; text: string };
const okCls = 'border-emerald-500/50 bg-emerald-500/10';
const badCls = 'border-red-500/50 bg-red-500/10';

// ─────────────────────────── shared primitives ───────────────────────────

function OptionButtons({ options, selected, correctSet, submitted, single, onToggle }: {
  options: Opt[]; selected: string[]; correctSet?: Set<string>; submitted: boolean; single: boolean; onToggle: (id: string) => void;
}) {
  return (
    <div className="space-y-1.5">
      {options.map((o) => {
        const chosen = selected.includes(o.id);
        const right = correctSet?.has(o.id);
        const cls = submitted && correctSet ? (right ? okCls : chosen ? badCls : 'opacity-60') : chosen ? 'border-primary bg-primary/10' : 'hover:bg-accent';
        return (
          <button key={o.id} type="button" onClick={() => onToggle(o.id)} disabled={submitted}
            className={`flex w-full items-center gap-2 rounded-md border px-2.5 py-1.5 text-left text-sm ${cls}`}>
            <span className={`grid size-4 shrink-0 place-items-center border ${single ? 'rounded-full' : 'rounded-sm'} ${chosen ? 'border-primary' : 'border-muted-foreground/40'}`}>
              {chosen && <span className="size-2 rounded-full bg-primary" />}
            </span>
            <span className="flex-1">{o.text}</span>
          </button>
        );
      })}
    </div>
  );
}

/** Choice family — one or many options, graded against correct ids or recorded. */
function ChoiceInteraction({ i, label, icon, options, correctIds, multi, graded }: {
  i: Interaction; label: string; icon: React.ReactNode; options: Opt[]; correctIds?: string[]; multi: boolean; graded: boolean;
}) {
  const [sel, setSel] = useState<string[]>([]);
  const correctSet = useMemo(() => new Set(correctIds ?? []), [correctIds]);
  const isCorrect = graded && sel.length === correctSet.size && sel.every((id) => correctSet.has(id));
  const ctrl = useInteraction({ id: i.id, graded, isCorrect, answerText: () => sel.map((id) => options.find((o) => o.id === id)?.text).filter(Boolean).join(', '), clear: () => setSel([]) });
  const locked = ctrl.phase !== 'input';
  const toggle = (id: string) => { if (locked) return; setSel((s) => (multi ? (s.includes(id) ? s.filter((x) => x !== id) : [...s, id]) : [id])); };
  const reveal = graded ? <div className="rounded-md border bg-card/40 px-2.5 py-1.5 text-xs text-muted-foreground">Ճիշտ պատասխան՝ {[...correctSet].map((id) => options.find((o) => o.id === id)?.text).filter(Boolean).join(', ')}</div> : null;
  return (
    <InteractionShell id={i.id} label={label} icon={icon} prompt={i.prompt} graded={graded} canSubmit={sel.length > 0} canComplete={sel.length > 0} controller={ctrl} feedback={i.feedback} reveal={reveal}>
      <OptionButtons options={options} selected={sel} correctSet={graded ? correctSet : undefined} submitted={locked} single={!multi} onToggle={toggle} />
    </InteractionShell>
  );
}

/** Order family — arrange items; graded against the correct sequence. */
function OrderInteraction({ i, label, icon }: { i: Interaction; label: string; icon: React.ReactNode }) {
  const cfg = (i.config ?? {}) as { items: Opt[] };
  const key = (i.correctAnswers as string[]) ?? [];
  const items = cfg.items ?? [];
  const [order, setOrder] = useState<string[]>(items.map((x) => x.id));
  const isCorrect = order.length === key.length && order.every((id, idx) => id === key[idx]);
  const ctrl = useInteraction({ id: i.id, graded: true, isCorrect, answerText: () => order.join(' > '), clear: () => setOrder(items.map((x) => x.id)) });
  const locked = ctrl.phase !== 'input';
  const move = (idx: number, dir: -1 | 1) => {
    if (locked) return;
    setOrder((o) => { const n = [...o]; const j = idx + dir; if (j < 0 || j >= n.length) return o; const a = n[idx]!, b = n[j]!; n[idx] = b; n[j] = a; return n; });
  };
  const reveal = <div className="rounded-md border bg-card/40 px-2.5 py-1.5 text-xs text-muted-foreground">Ճիշտ հերթականություն՝ {key.map((id) => items.find((x) => x.id === id)?.text).filter(Boolean).join(' → ')}</div>;
  return (
    <InteractionShell id={i.id} label={label} icon={icon} prompt={i.prompt} graded canSubmit controller={ctrl} feedback={i.feedback} reveal={reveal}>
      <ol className="space-y-1">
        {order.map((id, idx) => {
          const it = items.find((x) => x.id === id);
          const cls = locked ? (key[idx] === id ? okCls : badCls) : 'bg-card/40';
          return (
            <li key={id} className={`flex items-center gap-2 rounded-md border px-2.5 py-1.5 text-sm ${cls}`}>
              <span className="w-4 shrink-0 text-center text-muted-foreground">{idx + 1}</span>
              <span className="flex-1">{it?.text}</span>
              <button type="button" onClick={() => move(idx, -1)} disabled={locked || idx === 0} aria-label="Վեր" className="rounded p-0.5 hover:bg-accent disabled:opacity-30"><ChevronUp className="size-4" /></button>
              <button type="button" onClick={() => move(idx, 1)} disabled={locked || idx === order.length - 1} aria-label="Ներքև" className="rounded p-0.5 hover:bg-accent disabled:opacity-30"><ChevronDown className="size-4" /></button>
            </li>
          );
        })}
      </ol>
    </InteractionShell>
  );
}

/** Assign family — each row is matched to one option; graded against a key. */
function SelectAssignInteraction({ i, label, icon, rows, options, answerKey }: {
  i: Interaction; label: string; icon: React.ReactNode; rows: { id: string; text: string }[]; options: Opt[]; answerKey: Record<string, string | undefined>;
}) {
  const [asg, setAsg] = useState<Record<string, string>>({});
  const isCorrect = rows.every((r) => asg[r.id] === answerKey[r.id]);
  const ctrl = useInteraction({ id: i.id, graded: true, isCorrect, answerText: () => rows.map((r) => `${r.text}:${options.find((o) => o.id === asg[r.id])?.text ?? '—'}`).join(', '), clear: () => setAsg({}) });
  const locked = ctrl.phase !== 'input';
  const filled = rows.every((r) => asg[r.id]);
  const reveal = <div className="rounded-md border bg-card/40 px-2.5 py-1.5 text-xs text-muted-foreground">{rows.map((r) => `${r.text} → ${options.find((o) => o.id === answerKey[r.id])?.text ?? '—'}`).join('; ')}</div>;
  return (
    <InteractionShell id={i.id} label={label} icon={icon} prompt={i.prompt} graded canSubmit={filled} controller={ctrl} feedback={i.feedback} reveal={reveal}>
      <div className="space-y-1.5">
        {rows.map((r) => {
          const right = locked && asg[r.id] === answerKey[r.id];
          return (
            <div key={r.id} className={`flex items-center gap-2 rounded-md border px-2.5 py-1.5 text-sm ${locked ? (right ? okCls : badCls) : 'bg-card/40'}`}>
              <span className="flex-1">{r.text}</span>
              <select value={asg[r.id] ?? ''} disabled={locked} onChange={(e) => setAsg((a) => ({ ...a, [r.id]: e.target.value }))}
                className="rounded-md border bg-background/60 px-2 py-1 text-sm outline-none focus:border-primary">
                <option value="">— ընտրի՛ր —</option>
                {options.map((o) => <option key={o.id} value={o.id}>{o.text}</option>)}
              </select>
            </div>
          );
        })}
      </div>
    </InteractionShell>
  );
}

/** Reveal family — inspect items one by one; completes when all are seen. */
function RevealInteraction({ i, label, icon }: { i: Interaction; label: string; icon: React.ReactNode }) {
  const cfg = (i.config ?? {}) as { items: string[] };
  const items = cfg.items ?? [];
  const [n, setN] = useState(1);
  const all = n >= items.length;
  const ctrl = useInteraction({ id: i.id, graded: false, isCorrect: false, answerText: () => '', clear: () => setN(1) });
  return (
    <InteractionShell id={i.id} label={label} icon={icon} prompt={i.prompt} graded={false} canComplete={all} controller={ctrl} feedback={i.feedback}>
      <ol className="space-y-1.5">
        {items.slice(0, n).map((it, idx) => (
          <li key={idx} className="flex items-start gap-2 rounded-md border bg-card/40 px-2.5 py-1.5 text-sm duration-200 animate-in fade-in-0 slide-in-from-bottom-1">
            <span className="mt-0.5 flex size-4 shrink-0 items-center justify-center rounded-full bg-primary/15 text-[10px] font-bold text-primary">{idx + 1}</span>{it}
          </li>
        ))}
      </ol>
      {!all && ctrl.phase !== 'done' && (
        <button type="button" onClick={() => setN((v) => Math.min(items.length, v + 1))}
          className="mt-2 flex items-center gap-1 rounded-md border bg-card/40 px-2.5 py-1.5 text-xs font-medium hover:bg-accent">
          <Eye className="size-3.5 text-primary" /> Հաջորդը ({n}/{items.length})
        </button>
      )}
    </InteractionShell>
  );
}

/** Explore family — inspect points on a surface; opens Knowledge Cards. */
function HotspotInteraction({ i, label, icon, image }: { i: Interaction; label: string; icon: React.ReactNode; image?: boolean }) {
  const cfg = (i.config ?? {}) as { image?: string; points: { id: string; title: string; description?: string; x: number; y: number; entityId?: string }[] };
  const points = cfg.points ?? [];
  const ctx = useBlockContext();
  const [explored, setExplored] = useState<Set<string>>(new Set());
  const [active, setActive] = useState<string | null>(null);
  const all = points.length > 0 && explored.size >= points.length;
  const ctrl = useInteraction({ id: i.id, graded: false, isCorrect: false, answerText: () => '', clear: () => { setExplored(new Set()); setActive(null); } });
  const pick = (p: typeof points[number]) => { setActive(p.id); setExplored((s) => new Set(s).add(p.id)); if (p.entityId) ctx.onSelectEntity?.(p.entityId); };
  const cur = points.find((p) => p.id === active);
  return (
    <InteractionShell id={i.id} label={label} icon={icon} prompt={i.prompt} graded={false} canComplete={all} controller={ctrl} feedback={i.feedback}>
      <div className="relative aspect-[5/3] w-full overflow-hidden rounded-md border bg-card/40">
        {image && cfg.image && <img src={cfg.image} alt="" loading="lazy" className="absolute inset-0 h-full w-full object-contain" />}
        {points.map((p) => (
          <button key={p.id} type="button" aria-label={p.title} aria-pressed={active === p.id}
            data-hotspot-state={active === p.id ? 'selected' : explored.has(p.id) ? 'explored' : 'idle'}
            onClick={() => pick(p)} style={{ left: `${p.x}%`, top: `${p.y}%` }}
            className="group absolute z-10 size-5 -translate-x-1/2 -translate-y-1/2 touch-manipulation outline-none">
            <span className={`block size-4 rounded-full border-2 transition ${active === p.id ? 'scale-125 border-primary bg-primary/50 ring-4 ring-primary/20' : `border-primary/70 bg-primary/25 group-hover:scale-125 group-focus-visible:scale-125 ${explored.has(p.id) ? 'bg-primary/45' : ''}`}`} />
          </button>
        ))}
        <span className="absolute left-2 top-2 rounded bg-primary/85 px-1.5 py-0.5 text-[10px] font-medium text-primary-foreground">{explored.size}/{points.length}</span>
      </div>
      {cur && (
        <div className="mt-2 rounded-md border bg-card/40 px-2.5 py-1.5 text-sm">
          <span className="font-medium text-foreground">{cur.title}</span>
          {cur.description && <span className="text-muted-foreground"> — {cur.description}</span>}
        </div>
      )}
    </InteractionShell>
  );
}

/** Open family — a recorded free response; never judged. */
function OpenInteraction({ i, label, icon }: { i: Interaction; label: string; icon: React.ReactNode }) {
  const cfg = (i.config ?? {}) as { placeholder?: string };
  const [text, setText] = useState('');
  const ctrl = useInteraction({ id: i.id, graded: false, isCorrect: false, answerText: () => text, clear: () => setText('') });
  const locked = ctrl.phase === 'done';
  return (
    <InteractionShell id={i.id} label={label} icon={icon} prompt={i.prompt} graded={false} canComplete={text.trim().length > 0} controller={ctrl} feedback={i.feedback}>
      <textarea value={text} disabled={locked} onChange={(e) => setText(e.target.value)} rows={3} placeholder={cfg.placeholder ?? 'Գրի՛ր քո պատասխանը…'}
        className="w-full rounded-md border bg-background/60 px-2.5 py-1.5 text-sm outline-none focus:border-primary disabled:opacity-70" />
    </InteractionShell>
  );
}

/** Simulation — step through configured states and observe the outcome. */
function SimulationInteraction({ i, label, icon }: { i: Interaction; label: string; icon: React.ReactNode }) {
  const cfg = (i.config ?? {}) as { states: { label: string; description: string }[] };
  const states = cfg.states ?? [];
  const [idx, setIdx] = useState(0);
  const [touched, setTouched] = useState(false);
  const ctrl = useInteraction({ id: i.id, graded: false, isCorrect: false, answerText: () => '', clear: () => { setIdx(0); setTouched(false); } });
  const cur = states[idx];
  const go = (v: number) => { setTouched(true); setIdx(Math.min(states.length - 1, Math.max(0, v))); };
  return (
    <InteractionShell id={i.id} label={label} icon={icon} prompt={i.prompt} graded={false} canComplete={touched} controller={ctrl} feedback={i.feedback}>
      <div className="rounded-md border bg-card/40 p-3">
        <input type="range" min={0} max={Math.max(0, states.length - 1)} value={idx} onChange={(e) => go(Number(e.target.value))} className="w-full accent-primary" aria-label={i.prompt ?? label} />
        {cur && (
          <div className="mt-2">
            <div className="text-sm font-medium text-foreground">{cur.label}</div>
            <p className="text-sm text-muted-foreground">{cur.description}</p>
          </div>
        )}
        <div className="mt-1 text-[11px] tabular-nums text-muted-foreground">{idx + 1}/{states.length}</div>
      </div>
    </InteractionShell>
  );
}

// ─────────────────────────── the 21 registered interactions ───────────────────────────

const asOpts = (i: Interaction): Opt[] => ((i.config ?? {}) as { options?: Opt[] }).options ?? [];

export const MultipleChoiceInteraction = ({ i }: { i: Interaction }) => {
  const ids = (i.correctAnswers as string[]) ?? [];
  return <ChoiceInteraction i={i} label="Ընտրություն" icon={<ListChecks className="size-3.5" />} options={asOpts(i)} correctIds={ids} multi={ids.length > 1} graded />;
};
export const TrueFalseInteraction = ({ i }: { i: Interaction }) => (
  <ChoiceInteraction i={i} label="Ճիշտ / Սխալ" icon={<ToggleLeft className="size-3.5" />}
    options={[{ id: 'true', text: 'Ճիշտ' }, { id: 'false', text: 'Սխալ' }]} correctIds={[String(i.correctAnswers)]} multi={false} graded />
);
export const CompareInteraction = ({ i }: { i: Interaction }) => (
  <ChoiceInteraction i={i} label="Համեմատում" icon={<Scale className="size-3.5" />} options={asOpts(i)} correctIds={(i.correctAnswers as string[]) ?? []} multi={false} graded />
);
export const BuildInteraction = ({ i }: { i: Interaction }) => (
  <ChoiceInteraction i={i} label="Կառուցիր" icon={<Blocks className="size-3.5" />} options={asOpts(i)} correctIds={(i.correctAnswers as string[]) ?? []} multi graded />
);
export const PredictionInteraction = ({ i }: { i: Interaction }) => {
  const cfg = (i.config ?? {}) as { kind?: string };
  return cfg.kind === 'choice'
    ? <ChoiceInteraction i={i} label="Կանխատեսում" icon={<Brain className="size-3.5" />} options={asOpts(i)} multi={false} graded={false} />
    : <OpenInteraction i={i} label="Կանխատեսում" icon={<Brain className="size-3.5" />} />;
};

export const SortingInteraction = ({ i }: { i: Interaction }) => <OrderInteraction i={i} label="Դասավորում" icon={<ArrowUpDown className="size-3.5" />} />;
export const SequenceInteraction = ({ i }: { i: Interaction }) => <OrderInteraction i={i} label="Հաջորդականություն" icon={<ListOrdered className="size-3.5" />} />;
export const TimelineInteraction = ({ i }: { i: Interaction }) => <OrderInteraction i={i} label="Ժամանակագրություն" icon={<CalendarClock className="size-3.5" />} />;

export const MatchingInteraction = ({ i }: { i: Interaction }) => {
  const cfg = (i.config ?? {}) as { left: Opt[]; right: Opt[] };
  return <SelectAssignInteraction i={i} label="Համապատասխանեցում" icon={<ArrowLeftRight className="size-3.5" />} rows={cfg.right ?? []} options={cfg.left ?? []} answerKey={(i.correctAnswers as Record<string, string>) ?? {}} />;
};
export const ConnectInteraction = ({ i }: { i: Interaction }) => {
  const cfg = (i.config ?? {}) as { left: Opt[]; right: Opt[] };
  return <SelectAssignInteraction i={i} label="Կապակցում" icon={<Link2 className="size-3.5" />} rows={cfg.right ?? []} options={cfg.left ?? []} answerKey={(i.correctAnswers as Record<string, string>) ?? {}} />;
};
export const ClassificationInteraction = ({ i }: { i: Interaction }) => {
  const cfg = (i.config ?? {}) as { items: Opt[]; buckets: Opt[] };
  return <SelectAssignInteraction i={i} label="Դասակարգում" icon={<Boxes className="size-3.5" />} rows={cfg.items ?? []} options={cfg.buckets ?? []} answerKey={(i.correctAnswers as Record<string, string>) ?? {}} />;
};
export const DiagramLabelingInteraction = ({ i }: { i: Interaction }) => {
  const cfg = (i.config ?? {}) as { labels: Opt[]; slots: { id: string; hint: string }[] };
  return <SelectAssignInteraction i={i} label="Նշիր դիագրամը" icon={<Tags className="size-3.5" />} rows={(cfg.slots ?? []).map((s) => ({ id: s.id, text: s.hint }))} options={cfg.labels ?? []} answerKey={(i.correctAnswers as Record<string, string>) ?? {}} />;
};
export const FillDiagramInteraction = ({ i }: { i: Interaction }) => {
  const cfg = (i.config ?? {}) as { labels: Opt[]; slots: { id: string; hint: string }[] };
  return <SelectAssignInteraction i={i} label="Լրացրու դիագրամը" icon={<Tags className="size-3.5" />} rows={(cfg.slots ?? []).map((s) => ({ id: s.id, text: s.hint }))} options={cfg.labels ?? []} answerKey={(i.correctAnswers as Record<string, string>) ?? {}} />;
};

export const HotspotInteractionView = ({ i }: { i: Interaction }) => <HotspotInteraction i={i} label="Ակտիվ կետեր" icon={<MapPin className="size-3.5" />} />;
export const ImageExplorationInteraction = ({ i }: { i: Interaction }) => <HotspotInteraction i={i} label="Պատկերի ուսումնասիրում" icon={<ImageIcon className="size-3.5" />} image />;

export const RevealInteractionView = ({ i }: { i: Interaction }) => <RevealInteraction i={i} label="Բացահայտում" icon={<Eye className="size-3.5" />} />;
export const DiscoveryInteraction = ({ i }: { i: Interaction }) => <RevealInteraction i={i} label="Հայտնագործում" icon={<Sparkles className="size-3.5" />} />;
export const ObservationInteraction = ({ i }: { i: Interaction }) => <RevealInteraction i={i} label="Դիտարկում" icon={<Eye className="size-3.5" />} />;

export const ReflectionInteraction = ({ i }: { i: Interaction }) => <OpenInteraction i={i} label="Ինքնավերլուծություն" icon={<MessageCircleQuestion className="size-3.5" />} />;
export const ExplainInteraction = ({ i }: { i: Interaction }) => <OpenInteraction i={i} label="Բացատրիր" icon={<BookOpen className="size-3.5" />} />;

export const SimulationInteractionView = ({ i }: { i: Interaction }) => <SimulationInteraction i={i} label="Սիմուլյացիա" icon={<SlidersHorizontal className="size-3.5" />} />;
