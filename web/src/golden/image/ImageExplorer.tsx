/**
 * ImageExplorer — a reusable, fully interactive fullscreen image viewer.
 * Turns any Image Block into an interactive learning asset: zoom in/out/reset/fit,
 * drag-to-pan while zoomed, native fullscreen, plus optional data-driven hotspots,
 * labels, highlight regions and callouts. Hotspots respond to click/hover/focus/
 * touch; selecting one shows its callout and can open the existing Context Panel
 * Knowledge Card. An optional guided mode walks the suggested order without ever
 * locking exploration. Milestones are reported upward (never computed here) and
 * generic analytics are emitted. Nothing is specific to any image or subject.
 */
import { useEffect, useMemo, useRef, useState } from 'react';
import { ZoomIn, ZoomOut, RotateCcw, X, Maximize2, Minimize2, Compass, ChevronLeft, ChevronRight, ArrowRight } from 'lucide-react';
import type { ImageBlock, DiagramHotspot } from '../schema';

type ImageContent = ImageBlock['content'];

function emit(type: string, id: string) {
  try { window.dispatchEvent(new CustomEvent('chemverse:image', { detail: { type, id } })); } catch { /* ignore */ }
}

export function ImageExplorer({ content, onClose, explored, onExplore, onOpenEntity }: {
  content: ImageContent;
  onClose: () => void;
  explored?: Set<string>;
  onExplore?: (hotspotId: string) => void;
  onOpenEntity?: (entityId: string) => void;
}) {
  const [scale, setScale] = useState(1);
  const [tx, setTx] = useState(0);
  const [ty, setTy] = useState(0);
  const [failed, setFailed] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [fullscreen, setFullscreen] = useState(false);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [focusedId, setFocusedId] = useState<string | null>(null);
  const [guided, setGuided] = useState(false);
  const [guidedIndex, setGuidedIndex] = useState(0);
  const drag = useRef<{ x: number; y: number; tx: number; ty: number } | null>(null);
  const moved = useRef(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const markerRefs = useRef<(HTMLButtonElement | null)[]>([]);

  const hotspots = useMemo(() => content.hotspots ?? [], [content.hotspots]);
  const labels = content.labels ?? [];
  const order = useMemo(() => {
    const ids = content.explorationOrder?.length ? content.explorationOrder : hotspots.map((h) => h.id);
    return ids.map((hid) => hotspots.find((h) => h.id === hid)).filter((h): h is DiagramHotspot => !!h);
  }, [content.explorationOrder, hotspots]);
  const exploredCount = explored?.size ?? 0;
  const allExplored = hotspots.length > 0 && exploredCount >= hotspots.length;

  useEffect(() => { emit('image_opened', content.src); }, [content.src]);

  useEffect(() => {
    rootRef.current?.focus();
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape' && !document.fullscreenElement) onClose(); };
    window.addEventListener('keydown', onKey);
    const onFs = () => setFullscreen(!!document.fullscreenElement);
    document.addEventListener('fullscreenchange', onFs);
    return () => { window.removeEventListener('keydown', onKey); document.removeEventListener('fullscreenchange', onFs); };
  }, [onClose]);

  const zoomIn = () => setScale((s) => { const n = Math.min(5, +(s + 0.5).toFixed(2)); emit('image_zoomed', String(n)); return n; });
  const zoomOut = () => setScale((s) => {
    const n = Math.max(1, +(s - 0.5).toFixed(2));
    if (n === 1) { setTx(0); setTy(0); }
    emit('image_zoomed', String(n));
    return n;
  });
  const reset = () => { setScale(1); setTx(0); setTy(0); emit('image_zoomed', '1'); };
  const toggleFullscreen = async () => {
    emit('image_fullscreen', 'toggle');
    try {
      if (document.fullscreenElement) await document.exitFullscreen();
      else await rootRef.current?.requestFullscreen();
    } catch { /* ignore */ }
  };

  const onPointerDown = (e: React.PointerEvent) => {
    if (scale <= 1) return;
    drag.current = { x: e.clientX, y: e.clientY, tx, ty };
    moved.current = false;
    e.currentTarget.setPointerCapture?.(e.pointerId);
  };
  const onPointerMove = (e: React.PointerEvent) => {
    if (!drag.current) return;
    moved.current = true;
    setTx(drag.current.tx + (e.clientX - drag.current.x));
    setTy(drag.current.ty + (e.clientY - drag.current.y));
  };
  const onPointerUp = () => { drag.current = null; };

  const select = (h: DiagramHotspot) => { setActiveId(h.id); onExplore?.(h.id); emit('hotspot_selected', h.id); };
  const focusMarker = (hid: string) => markerRefs.current[hotspots.findIndex((x) => x.id === hid)]?.focus();
  const startGuided = () => { setGuided(true); setGuidedIndex(0); const f = order[0]; if (f) { select(f); focusMarker(f.id); } };
  const guidedGo = (delta: number) => {
    const next = Math.min(order.length - 1, Math.max(0, guidedIndex + delta));
    setGuidedIndex(next);
    const h = order[next];
    if (h) { select(h); focusMarker(h.id); }
  };
  const onKeyNav = (e: React.KeyboardEvent) => {
    if (!['ArrowRight', 'ArrowLeft', 'ArrowUp', 'ArrowDown'].includes(e.key)) return;
    if (markerRefs.current.every((n) => n !== document.activeElement)) return;
    e.preventDefault();
    const cur = markerRefs.current.findIndex((n) => n === document.activeElement);
    const dir = e.key === 'ArrowRight' || e.key === 'ArrowDown' ? 1 : -1;
    markerRefs.current[(cur + dir + hotspots.length) % hotspots.length]?.focus();
  };

  const activeHotspot = hotspots.find((h) => h.id === activeId);
  const hl = activeHotspot?.highlight ?? (hoveredId ? hotspots.find((h) => h.id === hoveredId)?.highlight : undefined);
  const state = failed ? 'error' : !loaded ? 'loading' : fullscreen ? 'fullscreen' : allExplored ? 'completed' : activeId ? 'hotspot_selected' : scale > 1 ? 'zoomed' : 'ready';
  const btn = 'flex size-8 items-center justify-center rounded-md border bg-secondary text-foreground hover:bg-accent disabled:opacity-40';

  return (
    <div ref={rootRef} tabIndex={-1} role="dialog" aria-modal="true" aria-label={content.title ?? content.altText}
      data-image-state={state}
      className="fixed inset-0 z-50 flex flex-col bg-background/90 outline-none backdrop-blur-md animate-in fade-in-0 duration-200 motion-reduce:animate-none"
      onClick={() => { if (!moved.current) onClose(); }}>
      {/* toolbar */}
      <div className="flex items-center gap-2 p-3" onClick={(e) => e.stopPropagation()}>
        <span className="min-w-0 flex-1 truncate text-sm font-semibold text-foreground">{content.title ?? content.caption ?? 'Պատկեր'}</span>
        {hotspots.length > 0 && <span className="mr-1 text-xs tabular-nums text-muted-foreground">{exploredCount}/{hotspots.length}</span>}
        <button type="button" aria-label="Փոքրացնել" className={btn} onClick={zoomOut} disabled={scale <= 1}><ZoomOut className="size-4" /></button>
        <span className="w-12 text-center text-xs tabular-nums text-muted-foreground">{Math.round(scale * 100)}%</span>
        <button type="button" aria-label="Խոշորացնել" className={btn} onClick={zoomIn} disabled={scale >= 5}><ZoomIn className="size-4" /></button>
        <button type="button" aria-label="Տեղավորել" className={btn} onClick={reset}><RotateCcw className="size-4" /></button>
        <button type="button" aria-label={fullscreen ? 'Դուրս լիաէկրանից' : 'Լիաէկրան'} className={btn} onClick={toggleFullscreen}>{fullscreen ? <Minimize2 className="size-4" /> : <Maximize2 className="size-4" />}</button>
        <button type="button" aria-label="Փակել" className={btn} onClick={onClose}><X className="size-4" /></button>
      </div>

      {/* image area */}
      <div
        className="relative flex min-h-0 flex-1 items-center justify-center overflow-hidden p-4"
        style={{ cursor: scale > 1 ? 'grab' : 'default', touchAction: 'none' }}
        onPointerDown={onPointerDown} onPointerMove={onPointerMove} onPointerUp={onPointerUp} onPointerLeave={onPointerUp}
        onKeyDown={onKeyNav}
      >
        <div className="relative" style={{ transform: `translate(${tx}px, ${ty}px) scale(${scale})`, transition: drag.current ? 'none' : 'transform 150ms', willChange: 'transform' }}>
          {failed ? (
            <div className="flex aspect-video w-[70vw] max-w-2xl items-center justify-center rounded border px-6 text-center text-sm text-muted-foreground" onClick={(e) => e.stopPropagation()}>
              {content.altText}
            </div>
          ) : (
            <img src={content.src} alt={content.altText} draggable={false} loading="lazy"
              onLoad={() => setLoaded(true)} onError={() => setFailed(true)} onClick={(e) => e.stopPropagation()}
              className="max-h-[72vh] max-w-[88vw] select-none rounded object-contain" />
          )}

          {/* highlight region */}
          {hl && (
            <div aria-hidden style={{ left: `${hl.x}%`, top: `${hl.y}%`, width: `${hl.w}%`, height: `${hl.h}%` }}
              className={`pointer-events-none absolute -translate-x-1/2 -translate-y-1/2 border-2 border-primary/70 bg-primary/10 ${hl.shape === 'ellipse' ? 'rounded-full' : 'rounded-md'}`} />
          )}
          {labels.map((l) => (
            <span key={l.id} style={{ left: `${l.x}%`, top: `${l.y}%` }}
              className="pointer-events-none absolute -translate-x-1/2 -translate-y-1/2 whitespace-nowrap rounded bg-background/70 px-1 text-[10px] font-medium text-foreground">
              {l.text}
            </span>
          ))}
          {hotspots.map((h, i) => {
            const on = activeId === h.id;
            const st = on ? 'selected' : hoveredId === h.id ? 'hovered' : focusedId === h.id ? 'focused' : explored?.has(h.id) ? 'explored' : 'idle';
            return (
              <button key={h.id} ref={(el) => { markerRefs.current[i] = el; }} type="button"
                aria-label={h.title} aria-pressed={on} data-hotspot-state={st}
                onClick={(e) => { e.stopPropagation(); select(h); }}
                onMouseEnter={() => { setHoveredId(h.id); emit('hotspot_hovered', h.id); }}
                onMouseLeave={() => setHoveredId((c) => (c === h.id ? null : c))}
                onFocus={() => setFocusedId(h.id)} onBlur={() => setFocusedId((c) => (c === h.id ? null : c))}
                style={{ left: `${h.x}%`, top: `${h.y}%` }}
                className="group absolute z-10 flex size-6 -translate-x-1/2 -translate-y-1/2 touch-manipulation items-center justify-center outline-none">
                <span className={`flex size-4 items-center justify-center rounded-full border-2 text-[8px] font-bold text-primary transition-all duration-200 motion-reduce:transition-none ${
                  on ? 'scale-125 border-primary bg-primary/60 ring-4 ring-primary/25' : `border-primary/80 bg-primary/30 group-hover:scale-125 group-focus-visible:scale-125 ${st === 'explored' ? 'bg-primary/50' : ''}`
                }`}>{h.icon}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* callout for the selected hotspot */}
      {activeHotspot && (
        <div className="mx-auto mb-2 w-[min(92vw,32rem)] rounded-lg border bg-card p-3 shadow-lg animate-in fade-in-0 slide-in-from-bottom-2 duration-200 motion-reduce:animate-none" onClick={(e) => e.stopPropagation()}>
          <div className="text-sm font-semibold text-foreground">{activeHotspot.title}</div>
          <p className="mt-0.5 text-sm text-muted-foreground">{activeHotspot.description}</p>
          {activeHotspot.entityId && onOpenEntity && (
            <button type="button" onClick={() => onOpenEntity(activeHotspot.entityId!)}
              className="mt-2 flex items-center gap-1 rounded-md bg-primary/10 px-2.5 py-1 text-xs font-medium text-primary hover:bg-primary/15">
              Բացել գիտելիքի քարտը <ArrowRight className="size-3.5" />
            </button>
          )}
        </div>
      )}

      {/* guided controls + caption */}
      <div className="p-3 text-center" onClick={(e) => e.stopPropagation()}>
        {hotspots.length > 0 && (
          <div className="mb-2 flex items-center justify-center gap-2 text-xs">
            {!guided ? (
              <button type="button" onClick={startGuided} className="flex items-center gap-1 rounded-md border bg-secondary px-2 py-1 font-medium hover:bg-accent">
                <Compass className="size-3.5 text-primary" /> Ուղեկցվող ռեժիմ
              </button>
            ) : (
              <span className="flex items-center gap-1">
                <button type="button" onClick={() => guidedGo(-1)} disabled={guidedIndex <= 0} aria-label="Նախորդ" className={btn.replace('size-8', 'size-7')}><ChevronLeft className="size-3.5" /></button>
                <span className="tabular-nums text-muted-foreground">{guidedIndex + 1}/{order.length}</span>
                <button type="button" onClick={() => guidedGo(1)} disabled={guidedIndex >= order.length - 1} aria-label="Հաջորդ" className={btn.replace('size-8', 'size-7')}><ChevronRight className="size-3.5" /></button>
                <button type="button" onClick={() => setGuided(false)} aria-label="Դուրս գալ" className={btn.replace('size-8', 'size-7')}><X className="size-3.5" /></button>
              </span>
            )}
          </div>
        )}
        {content.caption && <p className="text-sm text-foreground">{content.caption}</p>}
        {content.source && <p className="mt-0.5 text-xs text-muted-foreground">Աղբյուր՝ {content.source}</p>}
      </div>
    </div>
  );
}

/** Small affordance shown on hover over an image thumbnail. */
export function EnlargeHint() {
  return (
    <span className="pointer-events-none absolute right-2 top-2 flex items-center gap-1 rounded bg-black/50 px-1.5 py-0.5 text-[10px] text-white opacity-0 transition-opacity group-hover:opacity-100">
      <Maximize2 className="size-3" /> Խոշորացնել
    </span>
  );
}
