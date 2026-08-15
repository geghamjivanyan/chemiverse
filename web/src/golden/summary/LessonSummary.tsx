/**
 * LessonSummary — the reusable end-of-lesson summary. It shows what the learner
 * achieved and what to review next, rendering a fixed section order (each section
 * optional, empty ones hidden) purely from the result data it receives. It never
 * calculates progress; it reuses the Review Engine (via recommendations) and emits
 * generic analytics. Fully generic and subject-agnostic.
 */
import { useEffect } from 'react';
import { Trophy, BookOpen, Brain, Target, Star, RefreshCcw, AlertTriangle, BarChart3, ArrowRight, CheckCircle2, Clock, RotateCcw } from 'lucide-react';
import { V } from '../visual/tokens';
import type { LessonSummaryData } from './build';
import type { ReviewMode } from '../review/types';

function emit(type: string, extra?: Record<string, unknown>) {
  try { window.dispatchEvent(new CustomEvent('chemverse:summary', { detail: { type, ...extra } })); } catch { /* ignore */ }
}

export type SummaryActionKind = 'review' | 'review_mistakes' | 'continue' | 'back';
export interface SummaryAction { label: string; kind: SummaryActionKind; onSelect: () => void }

function Section({ title, icon, children }: { title: string; icon: React.ReactNode; children: React.ReactNode }) {
  return (
    <div>
      <div className={`mb-1.5 flex items-center gap-1.5 ${V.sectionLabel}`}><span className="text-primary">{icon}</span>{title}</div>
      {children}
    </div>
  );
}
function Stat({ value, label, icon }: { value: React.ReactNode; label: string; icon?: React.ReactNode }) {
  return (
    <div className="rounded-lg border bg-card/40 p-2.5 text-center">
      <div className="flex items-center justify-center gap-1 text-lg font-bold tabular-nums text-foreground">{icon}{value}</div>
      <div className="mt-0.5 text-[11px] text-muted-foreground">{label}</div>
    </div>
  );
}
const Chips = ({ items, onSelect }: { items: { id: string; title: string }[]; onSelect?: (id: string) => void }) => (
  <div className="flex flex-wrap gap-1.5">
    {items.map((it) => (
      <button key={it.id} type="button" onClick={() => onSelect?.(it.id)} disabled={!onSelect}
        className="rounded-full border bg-secondary/40 px-2.5 py-1 text-xs enabled:hover:bg-secondary disabled:cursor-default">{it.title}</button>
    ))}
  </div>
);

export function LessonSummary({ data, actions, onStartReview, onOpenConcept }: {
  data: LessonSummaryData;
  actions: SummaryAction[];
  onStartReview: (mode: ReviewMode) => void;
  onOpenConcept?: (conceptId: string) => void;
}) {
  const hasRec = data.recommendations.length > 0;
  useEffect(() => {
    emit('lesson_summary_opened', { lesson: data.title });
    emit('lesson_finished', { percent: data.progressPercent });
    if (hasRec) emit('review_recommended', { count: data.recommendations.length });
    return () => emit('lesson_summary_closed');
  }, [data.title, data.progressPercent, hasRec, data.recommendations.length]);

  const runAction = (a: SummaryAction) => {
    emit(a.kind === 'continue' || a.kind === 'back' ? 'continue_learning_clicked' : 'review_started_from_summary', { kind: a.kind });
    a.onSelect();
  };
  const startReview = (mode: ReviewMode) => { emit('review_started_from_summary', { mode }); onStartReview(mode); };
  const s = data.stats;

  return (
    <section data-summary-state={hasRec ? 'review_available' : 'completed'} aria-label="Դասի ամփոփում"
      className="space-y-5 rounded-xl border border-emerald-500/40 bg-emerald-500/[0.06] p-5 shadow-sm">
      {/* Lesson Completed */}
      <div className="text-center">
        <Trophy className="mx-auto size-9 text-emerald-600 duration-500 animate-in zoom-in-50 motion-reduce:animate-none" />
        <h2 className="mt-2 text-xl font-bold text-foreground">Դասն ավարտված է։</h2>
        <p className="mt-1 text-sm text-muted-foreground">Դու ավարտեցիր «{data.title}» դասի բոլոր {data.conceptCount} հասկացությունները՝ {data.progressPercent}%։</p>
      </div>

      {data.whatYouLearned.length > 0 && (
        <Section title="Ի՞նչ սովորեցիր" icon={<BookOpen className="size-3.5" />}>
          <ul className="space-y-1 text-sm text-foreground/90">
            {data.whatYouLearned.map((o, i) => (<li key={i} className="flex items-start gap-1.5"><CheckCircle2 className="mt-0.5 size-3.5 shrink-0 text-emerald-600" />{o}</li>))}
          </ul>
        </Section>
      )}

      {data.keyConcepts.length > 0 && (
        <Section title="Հիմնական հասկացություններ" icon={<Brain className="size-3.5" />}><Chips items={data.keyConcepts} onSelect={onOpenConcept} /></Section>
      )}

      {data.skills.length > 0 && (
        <Section title="Կիրառված հմտություններ" icon={<Target className="size-3.5" />}>
          <div className="flex flex-wrap gap-1.5">{data.skills.map((sk) => (<span key={sk} className="rounded-full bg-secondary/60 px-2.5 py-1 text-xs text-muted-foreground">{sk}</span>))}</div>
        </Section>
      )}

      {data.strengths.length > 0 && (
        <Section title="Ուժեղ կողմեր" icon={<Star className="size-3.5 text-amber-500" />}>
          <ul className="space-y-1 text-sm text-foreground/90">{data.strengths.map((st, i) => (<li key={i} className="flex items-start gap-1.5"><Star className="mt-0.5 size-3.5 shrink-0 text-amber-500" />{st}</li>))}</ul>
        </Section>
      )}

      {data.topicsToReview.length > 0 && (
        <Section title="Ինչ վերանայել" icon={<RefreshCcw className="size-3.5" />}><Chips items={data.topicsToReview} onSelect={onOpenConcept} /></Section>
      )}

      {data.commonMistakes.length > 0 && (
        <Section title="Հաճախակի սխալներ" icon={<AlertTriangle className="size-3.5" />}>
          <div className="space-y-2">
            {data.commonMistakes.map((m) => (
              <div key={m.id} className="rounded-md border border-amber-500/30 bg-amber-500/[0.06] p-2.5">
                <div className="text-sm font-medium text-foreground">{m.prompt}</div>
                {m.wrong && <div className="mt-1 text-xs"><span className="text-muted-foreground">Քո պատասխանը՝ </span><span className="text-red-600">{m.wrong}</span></div>}
                {m.explanation && <div className="mt-0.5 text-xs text-muted-foreground">{m.explanation}</div>}
              </div>
            ))}
          </div>
        </Section>
      )}

      <Section title="Դասի վիճակագրություն" icon={<BarChart3 className="size-3.5" />}>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
          <Stat value={`${data.progressPercent}%`} label="Առաջընթաց" />
          <Stat value={`${s.completedScreens}/${s.totalScreens}`} label="Էկրաններ" icon={<CheckCircle2 className="size-4 text-emerald-600" />} />
          <Stat value={`${s.completedInteractions}/${s.totalInteractions}`} label="Առաջադրանքներ" icon={<ListChecksIcon />} />
          <Stat value={s.firstTry} label="Առաջին փորձից" icon={<Star className="size-4 text-amber-500" />} />
          {typeof s.timeSpentMinutes === 'number' && s.timeSpentMinutes > 0 && (
            <Stat value={`${s.timeSpentMinutes} ր`} label="Ժամանակ" icon={<Clock className="size-4 text-muted-foreground" />} />
          )}
        </div>
      </Section>

      {data.recommendations.length > 0 && (
        <Section title="Կրկնության առաջարկներ" icon={<RotateCcw className="size-3.5" />}>
          <div className="flex flex-wrap gap-1.5">
            {data.recommendations.map((r) => (
              <button key={r.mode} type="button" onClick={() => startReview(r.mode)}
                className="flex items-center gap-1.5 rounded-md border bg-card/40 px-2.5 py-1.5 text-xs font-medium hover:bg-accent">
                {r.label} <span className="tabular-nums text-muted-foreground">{r.count}</span>
              </button>
            ))}
          </div>
        </Section>
      )}

      {actions.length > 0 && (
        <div className="flex flex-wrap gap-2 border-t pt-4">
          {actions.map((a, i) => {
            const primary = a.kind === 'continue';
            return (
              <button key={i} type="button" onClick={() => runAction(a)}
                className={primary
                  ? 'flex items-center gap-1.5 rounded-md bg-primary px-3 py-1.5 text-sm font-medium text-primary-foreground hover:opacity-90'
                  : 'flex items-center gap-1.5 rounded-md border bg-card/40 px-3 py-1.5 text-sm font-medium text-foreground hover:bg-accent'}>
                {a.label} <ArrowRight className="size-3.5" />
              </button>
            );
          })}
        </div>
      )}
    </section>
  );
}

function ListChecksIcon() { return <CheckCircle2 className="size-4 text-emerald-600" />; }
