/**
 * Golden Lesson — Block view components.
 * One visually distinct component per block type. Each reads its typed
 * `block.content`. Pure presentation.
 */
import { useEffect, useRef, useState } from 'react';
import { HelpCircle, ListChecks, Shapes, Image as ImageIcon, AlertTriangle, MapPin } from 'lucide-react';
import type { BlockOf } from '../schema';
import { InteractiveDiagram } from '../diagram/InteractiveDiagram';
import { ImageExplorer, EnlargeHint } from '../image/ImageExplorer';
import { useBlockContext } from './context';
import { V } from '../visual/tokens';
import { Callout, SectionLabel } from '../visual/primitives';

function emitImage(type: string, id: string) {
  try { window.dispatchEvent(new CustomEvent('chemverse:image', { detail: { type, id } })); } catch { /* ignore */ }
}

export function HeadingBlockView({ block }: { block: BlockOf<'heading'> }) {
  const { text, level } = block.content;
  const size = level === 1 ? 'text-2xl' : level === 3 ? 'text-base' : 'text-xl';
  return <h3 className={`${size} ${V.heading}`}>{text}</h3>;
}

export function TextBlockView({ block }: { block: BlockOf<'text'> }) {
  return <p className={V.body}>{block.content.text}</p>;
}

export function ImageBlockView({ block }: { block: BlockOf<'image'> }) {
  const { src, altText, caption } = block.content;
  const ctx = useBlockContext();
  const [failed, setFailed] = useState(false);
  const [open, setOpen] = useState(false);
  const [explored, setExplored] = useState<Set<string>>(new Set());
  const hotspots = block.content.hotspots ?? [];
  const interactive = hotspots.length > 0;

  // Register interactive images as a completable content block once.
  const ctxRef = useRef(ctx); ctxRef.current = ctx;
  useEffect(() => { if (interactive) ctxRef.current.registerCompletable?.(block.id); }, [interactive, block.id]);

  const onExplore = (hotspotId: string) => {
    setExplored((prev) => (prev.has(hotspotId) ? prev : (emitImage('hotspot_completed', hotspotId), new Set(prev).add(hotspotId))));
  };
  const doneRef = useRef(false);
  useEffect(() => {
    if (interactive && explored.size >= hotspots.length && !doneRef.current) {
      doneRef.current = true;
      emitImage('image_completed', block.id);
      ctxRef.current.onBlockComplete?.(block.id);
    }
  }, [explored, interactive, hotspots.length, block.id]);

  const onOpenEntity = (entityId: string) => {
    ctxRef.current.onSelectEntity?.(entityId);
    emitImage('knowledge_card_opened', entityId);
    setOpen(false);
  };

  return (
    <>
      <figure className="overflow-hidden rounded-lg border bg-card/40">
        <button type="button" onClick={(e) => { e.stopPropagation(); setOpen(true); }} className="group flex w-full items-center justify-center p-2" aria-label="Խոշորացնել պատկերը">
          {failed ? (
            <div className="flex aspect-[16/7] w-full items-center justify-center px-4 text-center text-xs text-muted-foreground">
              <span className="flex items-center gap-2"><ImageIcon className="size-4" /> {altText}</span>
            </div>
          ) : (
            <span className="relative inline-block max-w-full">
              <img src={src} alt={altText} loading="lazy" onError={() => setFailed(true)} className="mx-auto block max-h-[70vh] max-w-full object-contain" />
              {interactive && (
                <span className="pointer-events-none absolute left-2 top-2 flex items-center gap-1 rounded bg-primary/85 px-1.5 py-0.5 text-[10px] font-medium text-primary-foreground">
                  <MapPin className="size-3" /> {explored.size}/{hotspots.length}
                </span>
              )}
              <EnlargeHint />
            </span>
          )}
        </button>
        {caption && <figcaption className="border-t px-3 py-2 text-xs text-muted-foreground">{caption}</figcaption>}
      </figure>
      {open && <ImageExplorer content={block.content} onClose={() => setOpen(false)}
        explored={explored} onExplore={onExplore} onOpenEntity={onOpenEntity} />}
    </>
  );
}

export function DiagramBlockView({ block }: { block: BlockOf<'diagram'> }) {
  const { diagram, caption, hotspots, image } = block.content;
  // Interactive when the JSON provides hotspots or a background image.
  if ((hotspots && hotspots.length > 0) || image) {
    return <InteractiveDiagram content={block.content} blockId={block.id} />;
  }
  return (
    <figure className="rounded-lg border border-dashed bg-card/40 p-4">
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <Shapes className="size-4 shrink-0 text-primary" /> Դիագրամ · <span className="font-mono">{diagram}</span>
      </div>
      {caption && <figcaption className="mt-1.5 text-xs text-muted-foreground">{caption}</figcaption>}
    </figure>
  );
}

export function KeywordBlockView({ block }: { block: BlockOf<'keyword'> }) {
  const { term, gloss } = block.content;
  return (
    <div className="flex flex-wrap items-baseline gap-2">
      <span className="rounded-md border border-primary/30 bg-primary/10 px-2 py-0.5 text-sm font-medium text-primary">{term}</span>
      {gloss && <span className="text-sm text-muted-foreground">{gloss}</span>}
    </div>
  );
}

export function DefinitionBlockView({ block }: { block: BlockOf<'definition'> }) {
  const { term, definition } = block.content;
  return (
    <div className="rounded-md border-l-2 border-primary bg-card/40 px-3 py-2">
      <SectionLabel>Սահմանում</SectionLabel>
      <div className="mt-0.5 text-sm">
        <span className="font-semibold text-foreground">{term}</span>
        <span className="text-foreground/80"> — {definition}</span>
      </div>
    </div>
  );
}

export function FormulaBlockView({ block }: { block: BlockOf<'formula'> }) {
  const { formula, caption } = block.content;
  return (
    <figure className="rounded-md border bg-card/40 px-3 py-3 text-center">
      <code className="font-mono text-base text-foreground">{formula}</code>
      {caption && <figcaption className="mt-1 text-xs text-muted-foreground">{caption}</figcaption>}
    </figure>
  );
}

export function NoteBlockView({ block }: { block: BlockOf<'note'> }) {
  return <Callout variant="information">{block.content.text}</Callout>;
}

export function FactBlockView({ block }: { block: BlockOf<'fact'> }) {
  return <Callout variant="fact">{block.content.text}</Callout>;
}

export function QuestionBlockView({ block }: { block: BlockOf<'question'> }) {
  return (
    <div className="flex gap-2 rounded-md border bg-card/40 px-3 py-2.5">
      <HelpCircle className="mt-0.5 size-4 shrink-0 text-primary" />
      <div>
        <SectionLabel>Հարց</SectionLabel>
        <div className="mt-0.5 text-sm text-foreground/90">{block.content.prompt}</div>
      </div>
    </div>
  );
}

export function QuizBlockView({ block }: { block: BlockOf<'quiz'> }) {
  const { title, questions } = block.content;
  return (
    <div className="rounded-lg border bg-card/40 p-3">
      <div className="flex items-center gap-2 text-sm font-semibold"><ListChecks className="size-4 text-primary" /> {title ?? 'Թեստ'}</div>
      <div className="mt-2 space-y-3">
        {questions.map((q) => (
          <div key={q.id}>
            <div className="text-sm text-foreground/90">{q.prompt}</div>
            <div className="mt-1 space-y-1">
              {q.options.map((o) => (
                <div key={o.id} className="flex items-center gap-2 rounded border bg-background/40 px-2 py-1 text-xs text-muted-foreground">
                  <span className="size-3 shrink-0 rounded-full border" /> {o.text}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function DividerBlockView() {
  return <hr className="border-border/70" />;
}

/** Safe fallback for a block whose type has no registered renderer. Never crashes. */
export function UnknownBlockView({ block }: { block: { type?: string } }) {
  return (
    <div className="rounded-md border border-dashed border-amber-500/40 bg-amber-500/[0.06] px-3 py-2 text-xs text-muted-foreground">
      <span className="flex items-center gap-2">
        <AlertTriangle className="size-4 shrink-0 text-amber-500" />
        Անհայտ բլոկ՝ «{block?.type ?? '—'}» (renderer չի գրանցված)
      </span>
    </div>
  );
}
