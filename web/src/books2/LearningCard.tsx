import { useState } from 'react';
import { X, Star, CheckCircle2, Circle, CornerUpRight, ChevronLeft, ChevronRight } from 'lucide-react';
import { KnowledgeBody } from '../books/BookSidePanel';
import type { Confidence, LearningBlock } from './model';
import { TYPE_META, CONFIDENCE_META } from './blockTypes';

/** Правая панель = активный Learning Block: Type · Title · Description · Lesson · Page · status · Favorite · Notes · Open location · Prev/Next. */
export function LearningCard({ block, lessonTitle, onToggleComplete, onToggleFavorite, onNote, onConfidence, onOpenPage, onOpenConcept, onPrev, onNext, hasPrev, hasNext, onClose }: {
  block: LearningBlock;
  lessonTitle?: string;
  onToggleComplete: () => void;
  onToggleFavorite: () => void;
  onNote: (text: string) => void;
  onConfidence: (c: Confidence | undefined) => void;
  onOpenPage: () => void;
  onOpenConcept?: () => void;
  onPrev: () => void;
  onNext: () => void;
  hasPrev: boolean;
  hasNext: boolean;
  onClose: () => void;
}) {
  const [note, setNote] = useState(block.note ?? '');
  const done = block.completed;
  const fav = block.favorite;
  const meta = TYPE_META[block.type];

  return (
    <div className="flex h-full min-h-0 flex-col rounded-lg border bg-card/10">
      <div className="border-b px-3 py-2.5">
        <div className="flex items-start gap-2">
          <span className="text-lg leading-none">{meta.icon}</span>
          <div className="min-w-0 flex-1">
            <div className="line-clamp-2 text-sm font-semibold">{block.title}</div>
            <div className="mt-1 flex flex-wrap items-center gap-2 text-xs">
              <span className="rounded bg-secondary/70 px-1.5 py-0.5 text-muted-foreground">{meta.label}</span>
              <span className="font-mono text-muted-foreground">էջ {block.page}</span>
              <span className={done ? 'text-primary' : 'text-muted-foreground'}>{done ? '✓ ավարտված' : '○ ընթացքում'}</span>
            </div>
            {lessonTitle && <div className="mt-0.5 line-clamp-1 text-[11px] text-muted-foreground">📖 {lessonTitle}</div>}
          </div>
          <button onClick={onClose} aria-label="Փակել" className="flex size-7 shrink-0 items-center justify-center rounded-md bg-secondary/70 text-muted-foreground hover:text-foreground">
            <X className="size-4" />
          </button>
        </div>
      </div>

      <div className="min-h-0 flex-1 overflow-auto">
        {block.matKey ? (
          <KnowledgeBody matKey={block.matKey} />
        ) : (
          <div className="p-3">
            <div className="mb-1 text-[11px] font-medium uppercase tracking-wide text-muted-foreground">Նկարագրություն</div>
            <p className="text-[15px] leading-relaxed text-foreground/90">{block.description || '—'}</p>
            <button onClick={onOpenPage} className="mt-3 inline-flex items-center gap-1.5 rounded-md border bg-secondary/40 px-2.5 py-1 text-xs text-muted-foreground hover:text-foreground">
              <CornerUpRight className="size-3.5" /> Բացել դասագրքում (էջ {block.page})
            </button>
          </div>
        )}
      </div>

      <div className="space-y-2 border-t p-2.5">
        <div className="flex items-center gap-1">
          <span className="mr-1 shrink-0 text-[11px] font-medium uppercase tracking-wide text-muted-foreground">Իմ ուսումը</span>
          {CONFIDENCE_META.map((c) => (
            <button key={c.id} onClick={() => onConfidence(block.confidence === c.id ? undefined : c.id)} title={c.label}
              className={`flex-1 rounded-md border py-1 text-sm transition ${block.confidence === c.id ? `${c.bg} ${c.ring}` : 'bg-secondary/40 opacity-60 hover:opacity-100'}`}>
              {c.emoji}
            </button>
          ))}
        </div>
        {onOpenConcept && (
          <button onClick={onOpenConcept} className="flex w-full items-center justify-center gap-1.5 rounded-md border border-primary/30 bg-primary/5 px-3 py-1.5 text-xs font-medium text-primary hover:bg-primary/10">
            🔗 Բացել հասկացությունը
          </button>
        )}
        <div className="flex gap-2">
          <button onClick={onToggleComplete}
            className={`flex flex-1 items-center justify-center gap-1.5 rounded-md px-3 py-1.5 text-sm font-medium transition ${done ? 'bg-primary text-primary-foreground' : 'border bg-secondary/40 text-foreground hover:bg-secondary'}`}>
            {done ? <CheckCircle2 className="size-4" /> : <Circle className="size-4" />}
            {done ? 'Ավարտված' : 'Նշել ավարտված'}
          </button>
          <button onClick={onToggleFavorite} title="Ընտրանի"
            className={`flex size-9 items-center justify-center rounded-md border transition ${fav ? 'border-amber-400/40 bg-amber-400/15 text-amber-400' : 'bg-secondary/40 text-muted-foreground hover:text-foreground'}`}>
            <Star className={`size-4 ${fav ? 'fill-current' : ''}`} />
          </button>
        </div>
        <textarea value={note} onChange={(e) => { setNote(e.target.value); onNote(e.target.value); }}
          placeholder="Անձնական նշում…" rows={2}
          className="w-full resize-none rounded-md border bg-background px-2 py-1.5 text-sm outline-none focus:ring-1 focus:ring-ring" />
        <div className="flex gap-2">
          <button onClick={onPrev} disabled={!hasPrev} className="flex flex-1 items-center justify-center gap-1 rounded-md border bg-secondary/40 px-2 py-1.5 text-xs text-foreground hover:bg-secondary disabled:opacity-40">
            <ChevronLeft className="size-3.5" /> Նախորդ բլոկ
          </button>
          <button onClick={onNext} disabled={!hasNext} className="flex flex-1 items-center justify-center gap-1 rounded-md border bg-secondary/40 px-2 py-1.5 text-xs text-foreground hover:bg-secondary disabled:opacity-40">
            Հաջորդ բլոկ <ChevronRight className="size-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}
