import { useMemo } from 'react';
import { X, Network, CornerUpRight, BookOpen } from 'lucide-react';
import { KnowledgeBody } from '../../books/BookSidePanel';
import type { Lesson, LearningBlock } from '../model';
import { TYPE_META } from '../blockTypes';
import { getEntity, relatedConcepts, relatedBlocks, ENTITY_TYPE_LABEL } from './store';

/** Knowledge Mode: сущность знания — тип, описание, связанные концепты (навигация), где встречается, связанные блоки. */
export function KnowledgePanel({ entityId, lessons, onNavigate, onOpenBlock, onOpenLesson, onClose }: {
  entityId: string;
  lessons: Lesson[];
  onNavigate: (id: string) => void;
  onOpenBlock: (block: LearningBlock) => void;
  onOpenLesson: (lessonId: string) => void;
  onClose: () => void;
}) {
  const entity = useMemo(() => getEntity(entityId, lessons), [entityId, lessons]);
  const concepts = useMemo(() => (entity ? relatedConcepts(entity) : []), [entity]);
  const blocks = useMemo(() => (entity ? relatedBlocks(entity, lessons) : []), [entity, lessons]);
  const lessonTitle = (id: string) => lessons.find((l) => l.id === id)?.title ?? id;

  if (!entity) return null;
  // группировка связанных блоков по типу
  const groups = new Map<string, LearningBlock[]>();
  for (const b of blocks) { const a = groups.get(b.type) ?? []; a.push(b); groups.set(b.type, a); }

  return (
    <div className="flex h-full min-h-0 flex-col rounded-lg border bg-card/10">
      <div className="flex items-start gap-2 border-b px-3 py-2.5">
        <Network className="mt-0.5 size-4 shrink-0 text-primary" />
        <div className="min-w-0 flex-1">
          <div className="line-clamp-2 text-sm font-semibold">{entity.name}</div>
          <div className="mt-1 text-xs"><span className="rounded bg-primary/15 px-1.5 py-0.5 text-primary">{ENTITY_TYPE_LABEL[entity.type]}</span></div>
        </div>
        <button onClick={onClose} aria-label="Փակել" className="flex size-7 shrink-0 items-center justify-center rounded-md bg-secondary/70 text-muted-foreground hover:text-foreground">
          <X className="size-4" />
        </button>
      </div>

      <div className="min-h-0 flex-1 space-y-3 overflow-auto p-3">
        {entity.matKey && (
          <div className="overflow-hidden rounded-lg border bg-background/40"><KnowledgeBody matKey={entity.matKey} /></div>
        )}

        {entity.formula && (
          <div className="rounded-lg border bg-background/40 px-3 py-2.5">
            <div className="mb-1 text-[11px] font-medium uppercase tracking-wide text-muted-foreground">Բանաձև</div>
            <div className="font-mono text-lg tracking-wide text-foreground">{entity.formula}</div>
          </div>
        )}

        <div>
          <div className="mb-1 text-[11px] font-medium uppercase tracking-wide text-muted-foreground">Նկարագրություն</div>
          <p className="text-[15px] leading-relaxed text-foreground/90">{entity.description}</p>
        </div>

        {concepts.length > 0 && (
          <div>
            <div className="mb-1 text-[11px] font-medium uppercase tracking-wide text-muted-foreground">Կապված հասկացություններ</div>
            <div className="flex flex-wrap gap-1.5">
              {concepts.map((c) => (
                <button key={c.id} onClick={() => onNavigate(c.id)} className="rounded-full border bg-secondary/40 px-2.5 py-1 text-xs hover:bg-secondary">{c.name}</button>
              ))}
            </div>
          </div>
        )}

        <div>
          <div className="mb-1 text-[11px] font-medium uppercase tracking-wide text-muted-foreground">Հանդիպում է</div>
          {entity.lessonIds.length === 0 && <div className="text-xs text-muted-foreground">—</div>}
          <div className="space-y-0.5">
            {entity.lessonIds.slice(0, 8).map((id) => (
              <button key={id} onClick={() => onOpenLesson(id)} className="flex w-full items-center gap-1.5 rounded px-1.5 py-1 text-left text-xs hover:bg-accent">
                <BookOpen className="size-3.5 shrink-0 text-muted-foreground" /> <span className="line-clamp-1 flex-1">{lessonTitle(id)}</span>
              </button>
            ))}
          </div>
          {entity.pageNumbers.length > 0 && (
            <div className="mt-1 px-1.5 text-[11px] text-muted-foreground">Էջեր՝ {entity.pageNumbers.slice(0, 12).join(', ')}{entity.pageNumbers.length > 12 ? '…' : ''}</div>
          )}
        </div>

        {[...groups.entries()].map(([type, list]) => (
          <div key={type}>
            <div className="mb-1 text-[11px] font-medium uppercase tracking-wide text-muted-foreground">Կապված՝ {TYPE_META[type as keyof typeof TYPE_META].label}</div>
            <div className="space-y-0.5">
              {list.slice(0, 6).map((b) => (
                <button key={b.id} onClick={() => onOpenBlock(b)} className="flex w-full items-center gap-1.5 rounded px-1.5 py-1 text-left text-xs hover:bg-accent">
                  <span className="shrink-0 text-sm leading-none">{TYPE_META[b.type].icon}</span>
                  <span className="line-clamp-1 flex-1 text-foreground/80">{b.title}</span>
                  <CornerUpRight className="size-3 shrink-0 text-muted-foreground" />
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
