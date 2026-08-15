/**
 * InteractiveDiagram — a reusable, JSON-driven interactive diagram engine.
 * Renders a background (image or a drawn fallback) with positioned hotspots,
 * labels and highlight regions — all by percentage, so they scale across desktop,
 * tablet and mobile. Hotspots respond to hover, click, keyboard focus and touch;
 * selecting one highlights it, shows its info and (when it carries an entity)
 * opens the existing Context Panel Knowledge Card. An optional guided mode walks
 * the suggested exploration order without ever locking free exploration. The
 * component reports exploration milestones to the Progress Engine and emits
 * generic analytics. Nothing here is specific to any diagram or subject.
 */
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Compass, ChevronLeft, ChevronRight, X } from 'lucide-react';
import type { DiagramBlock, DiagramHotspot } from '../schema';
import { useDiagramSelection } from './selection';
import { useBlockContext } from '../blocks/context';

type HotspotState = 'idle' | 'hovered' | 'focused' | 'selected' | 'explored';

function emit(type: string, id: string) {
  try { window.dispatchEvent(new CustomEvent('chemverse:diagram', { detail: { type, id } })); } catch { /* ignore */ }
}

/** Self-contained illustration used when no background image is supplied. */
function DiagramBackdrop() {
  return (
    <svg viewBox="0 0 100 100" preserveAspectRatio="xMidYMid meet" className="absolute inset-0 h-full w-full text-primary" aria-hidden>
      <ellipse cx="50" cy="50" rx="42" ry="26" fill="none" stroke="currentColor" strokeWidth="0.8" opacity="0.3" />
      <ellipse cx="50" cy="50" rx="26" ry="42" fill="none" stroke="currentColor" strokeWidth="0.8" opacity="0.15" />
      <circle cx="46" cy="47" r="6" fill="currentColor" opacity="0.4" />
      <circle cx="55" cy="53" r="6" fill="currentColor" opacity="0.2" />
      <circle cx="90" cy="50" r="3" fill="currentColor" opacity="0.9" />
    </svg>
  );
}

export function InteractiveDiagram({ content, blockId }: { content: DiagramBlock['content']; blockId?: string }) {
  const ctx = useBlockContext();
  const sel = useDiagramSelection();
  const ctxRef = useRef(ctx); ctxRef.current = ctx;
  const selRef = useRef(sel); selRef.current = sel;

  const [failed, setFailed] = useState(false);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [focusedId, setFocusedId] = useState<string | null>(null);
  const [explored, setExplored] = useState<Set<string>>(new Set());
  const [guided, setGuided] = useState(false);
  const [guidedIndex, setGuidedIndex] = useState(0);

  const hotspots = useMemo(() => content.hotspots ?? [], [content.hotspots]);
  const labels = content.labels ?? [];
  const order = useMemo(() => {
    const ids = content.explorationOrder?.length ? content.explorationOrder : hotspots.map((h) => h.id);
    return ids.map((hid) => hotspots.find((h) => h.id === hid)).filter((h): h is DiagramHotspot => !!h);
  }, [content.explorationOrder, hotspots]);
  const markerRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const showImage = !!content.image && !failed;

  // Announce open + register as a completable content block once.
  const id = blockId ?? 'diagram';
  useEffect(() => { ctxRef.current.registerCompletable?.(id); emit('diagram_opened', id); }, [id]);

  const select = useCallback((h: DiagramHotspot) => {
    setActiveId(h.id);
    setExplored((prev) => {
      if (prev.has(h.id)) return prev;
      emit('hotspot_completed', h.id);
      return new Set(prev).add(h.id);
    });
    emit('hotspot_selected', h.id);
    if (h.entityId && ctxRef.current.onSelectEntity) ctxRef.current.onSelectEntity(h.entityId);
    else selRef.current?.onSelectHotspot(h);
  }, []);

  // Report the exploration milestone (all hotspots seen) to the Progress Engine.
  const doneRef = useRef(false);
  useEffect(() => {
    if (hotspots.length > 0 && explored.size >= hotspots.length && !doneRef.current) {
      doneRef.current = true;
      emit('diagram_completed', id);
      ctxRef.current.onBlockComplete?.(id);
    }
  }, [explored, hotspots.length, id]);

  const focusMarker = (hid: string) => markerRefs.current[hotspots.findIndex((x) => x.id === hid)]?.focus();
  const startGuided = () => {
    setGuided(true); setGuidedIndex(0);
    const first = order[0];
    if (first) { select(first); focusMarker(first.id); }
  };
  const guidedGo = (delta: number) => {
    const next = Math.min(order.length - 1, Math.max(0, guidedIndex + delta));
    setGuidedIndex(next);
    const h = order[next];
    if (h) { select(h); focusMarker(h.id); }
  };

  // Roving arrow-key navigation between hotspots. Stop keys from bubbling to the
  // block-selection wrapper (which would clear the open Knowledge Card).
  const onKeyDown = (e: React.KeyboardEvent) => {
    e.stopPropagation();
    if (!['ArrowRight', 'ArrowLeft', 'ArrowUp', 'ArrowDown'].includes(e.key)) return;
    e.preventDefault();
    const cur = markerRefs.current.findIndex((n) => n === document.activeElement);
    if (cur < 0) { markerRefs.current[0]?.focus(); return; }
    const dir = e.key === 'ArrowRight' || e.key === 'ArrowDown' ? 1 : -1;
    markerRefs.current[(cur + dir + hotspots.length) % hotspots.length]?.focus();
  };

  const hotspotState = (h: DiagramHotspot): HotspotState =>
    activeId === h.id ? 'selected' : hoveredId === h.id ? 'hovered' : focusedId === h.id ? 'focused' : explored.has(h.id) ? 'explored' : 'idle';
  const diagramState = explored.size === 0 ? 'idle' : explored.size >= hotspots.length ? 'completed' : 'exploring';

  const activeHotspot = hotspots.find((h) => h.id === activeId) ?? (hoveredId ? hotspots.find((h) => h.id === hoveredId) : undefined);
  const hl = activeHotspot?.highlight;

  return (
    <figure data-diagram-state={diagramState} onClick={(e) => e.stopPropagation()}>
      <div
        role="group"
        aria-label={content.caption ?? 'Ինտերակտիվ գծապատկեր'}
        onKeyDown={onKeyDown}
        className="relative aspect-[4/3] w-full overflow-hidden rounded-lg border bg-card/40"
      >
        {showImage
          ? <img src={content.image} alt={content.caption ?? 'Diagram'} loading="lazy" onError={() => setFailed(true)} className="absolute inset-0 h-full w-full object-contain" />
          : <DiagramBackdrop />}

        {/* highlight region for the active/hovered hotspot */}
        {hl && (
          <div
            aria-hidden
            style={{ left: `${hl.x}%`, top: `${hl.y}%`, width: `${hl.w}%`, height: `${hl.h}%` }}
            className={`pointer-events-none absolute -translate-x-1/2 -translate-y-1/2 border-2 border-primary/60 bg-primary/10 transition-all duration-200 motion-reduce:transition-none ${hl.shape === 'ellipse' ? 'rounded-full' : 'rounded-md'}`}
          />
        )}

        {labels.map((l) => (
          <span key={l.id} style={{ left: `${l.x}%`, top: `${l.y}%` }}
            className="pointer-events-none absolute -translate-x-1/2 -translate-y-1/2 whitespace-nowrap text-[10px] font-medium text-muted-foreground">
            {l.text}
          </span>
        ))}

        {hotspots.map((h, i) => {
          const state = hotspotState(h);
          const on = state === 'selected';
          return (
            <button
              key={h.id}
              ref={(el) => { markerRefs.current[i] = el; }}
              type="button"
              aria-label={h.title}
              aria-pressed={on}
              data-hotspot-state={state}
              onClick={(e) => { e.stopPropagation(); select(h); }}
              onMouseEnter={() => { setHoveredId(h.id); emit('hotspot_hovered', h.id); }}
              onMouseLeave={() => setHoveredId((c) => (c === h.id ? null : c))}
              onFocus={() => setFocusedId(h.id)}
              onBlur={() => setFocusedId((c) => (c === h.id ? null : c))}
              style={{ left: `${h.x}%`, top: `${h.y}%` }}
              className="group absolute z-10 flex size-6 -translate-x-1/2 -translate-y-1/2 touch-manipulation items-center justify-center outline-none"
            >
              <span className={`flex size-4 items-center justify-center rounded-full border-2 text-[8px] font-bold text-primary transition-all duration-200 motion-reduce:transition-none ${
                on
                  ? 'scale-125 border-primary bg-primary/50 text-primary-foreground ring-4 ring-primary/20'
                  : `border-primary/70 bg-primary/20 group-hover:scale-125 group-hover:bg-primary/40 group-focus-visible:scale-125 ${state === 'explored' ? 'bg-primary/40' : ''}`
              }`}>
                {h.icon}
              </span>
              <span className={`pointer-events-none absolute bottom-full left-1/2 mb-1 -translate-x-1/2 whitespace-nowrap rounded border bg-card px-1.5 py-0.5 text-[10px] font-medium text-foreground shadow transition-opacity duration-150 motion-reduce:transition-none ${
                on ? 'opacity-100' : 'opacity-0 group-hover:opacity-100 group-focus-visible:opacity-100'
              }`}>
                {h.title}
              </span>
            </button>
          );
        })}
      </div>

      {/* Exploration controls — guided mode never locks free exploration. */}
      {hotspots.length > 0 && (
        <div className="mt-2 flex flex-wrap items-center gap-2 text-xs">
          <span className="tabular-nums text-muted-foreground">Ուսումնասիրված՝ {explored.size}/{hotspots.length}</span>
          {!guided ? (
            <button type="button" onClick={startGuided}
              className="ml-auto flex items-center gap-1 rounded-md border bg-card/40 px-2 py-1 font-medium hover:bg-accent">
              <Compass className="size-3.5 text-primary" /> Ուղեկցվող ռեժիմ
            </button>
          ) : (
            <span className="ml-auto flex items-center gap-1">
              <button type="button" onClick={() => guidedGo(-1)} disabled={guidedIndex <= 0} aria-label="Նախորդ"
                className="flex size-6 items-center justify-center rounded-md border bg-card/40 hover:bg-accent disabled:opacity-40"><ChevronLeft className="size-3.5" /></button>
              <span className="tabular-nums text-muted-foreground">{guidedIndex + 1}/{order.length}</span>
              <button type="button" onClick={() => guidedGo(1)} disabled={guidedIndex >= order.length - 1} aria-label="Հաջորդ"
                className="flex size-6 items-center justify-center rounded-md border bg-card/40 hover:bg-accent disabled:opacity-40"><ChevronRight className="size-3.5" /></button>
              <button type="button" onClick={() => setGuided(false)} aria-label="Դուրս գալ"
                className="flex size-6 items-center justify-center rounded-md border bg-card/40 hover:bg-accent"><X className="size-3.5" /></button>
            </span>
          )}
        </div>
      )}

      {content.caption && <figcaption className="mt-1.5 text-xs text-muted-foreground">{content.caption}</figcaption>}
    </figure>
  );
}
