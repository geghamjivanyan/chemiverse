import { useEffect, useRef, useState, type ReactNode, type MouseEvent as ReactMouseEvent } from 'react';

// Переиспользуемый IDE-style ресайз 3-х панелей (левая/центр/правая): перетаскиваемые
// разделители, min/max, сохранение в localStorage, сброс по двойному клику.
// Слушатели mousemove/mouseup вешаются на window ИМПЕРАТИВНО в mousedown (свежее замыкание
// на каждый drag), а iframe на время drag получает pointer-events:none (см. index.css),
// чтобы события доходили до окна даже когда курсор над книгой.
const HANDLE = 6; // px — ширина зоны захвата

export interface PaneCfg { default: number; min: number; max: number }
interface Widths { left: number; right: number }

export function ResizablePanes({ storageKey, left, center, right, leftCfg, rightCfg, centerMin = 500, className = '' }: {
  storageKey: string;
  left: ReactNode; center: ReactNode; right: ReactNode;
  leftCfg: PaneCfg; rightCfg: PaneCfg; centerMin?: number; className?: string;
}) {
  const [w, setW] = useState<Widths>(() => {
    try { const s = JSON.parse(localStorage.getItem(storageKey) || 'null'); if (s && typeof s.left === 'number' && typeof s.right === 'number') return s; } catch { /* ignore */ }
    return { left: leftCfg.default, right: rightCfg.default };
  });
  const wRef = useRef(w); wRef.current = w;
  const containerRef = useRef<HTMLDivElement>(null);
  const save = (v: Widths) => { try { localStorage.setItem(storageKey, JSON.stringify(v)); } catch { /* ignore */ } };

  const startDrag = (which: 'left' | 'right') => (e: ReactMouseEvent) => {
    e.preventDefault();
    document.body.classList.add('resizing-panes'); // index.css: iframe pointer-events:none + курсор/без выделения
    const move = (ev: MouseEvent) => {
      const el = containerRef.current; if (!el) return;
      const rect = el.getBoundingClientRect();
      if (which === 'left') {
        const maxLeft = Math.min(leftCfg.max, rect.width - wRef.current.right - centerMin - HANDLE * 2);
        const nl = Math.max(leftCfg.min, Math.min(ev.clientX - rect.left, maxLeft));
        setW((p) => (p.left === nl ? p : { ...p, left: nl }));
      } else {
        const maxRight = Math.min(rightCfg.max, rect.width - wRef.current.left - centerMin - HANDLE * 2);
        const nr = Math.max(rightCfg.min, Math.min(rect.right - ev.clientX, maxRight));
        setW((p) => (p.right === nr ? p : { ...p, right: nr }));
      }
    };
    const up = () => {
      document.body.classList.remove('resizing-panes');
      save(wRef.current);
      window.removeEventListener('mousemove', move);
      window.removeEventListener('mouseup', up);
    };
    window.addEventListener('mousemove', move);
    window.addEventListener('mouseup', up);
  };

  const reset = (which: 'left' | 'right') => () => setW((p) => {
    const v = { ...p, [which]: which === 'left' ? leftCfg.default : rightCfg.default };
    save(v); return v;
  });

  // при ресайзе окна — поджать боковые, чтобы центр не схлопнулся ниже минимума
  useEffect(() => {
    const onResize = () => {
      const el = containerRef.current; if (!el) return;
      const tw = el.getBoundingClientRect().width;
      setW((p) => {
        const lft = Math.min(p.left, Math.max(leftCfg.min, tw - p.right - centerMin - HANDLE * 2));
        const rgt = Math.min(p.right, Math.max(rightCfg.min, tw - lft - centerMin - HANDLE * 2));
        return lft === p.left && rgt === p.right ? p : { left: lft, right: rgt };
      });
    };
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, [leftCfg.min, rightCfg.min, centerMin]);

  const handle = (which: 'left' | 'right') => (
    <div onMouseDown={startDrag(which)} onDoubleClick={reset(which)}
      title="Քաշեք · կրկնակի սեղմում՝ վերականգնում"
      className="group relative z-10 flex w-1.5 shrink-0 cursor-col-resize touch-none items-stretch justify-center"
      role="separator" aria-orientation="vertical">
      <div className="w-px bg-border transition-all group-hover:w-0.5 group-hover:bg-primary/60" />
    </div>
  );

  return (
    <div ref={containerRef} className={`flex min-h-0 ${className}`}>
      <div style={{ width: w.left }} className="min-w-0 shrink-0">{left}</div>
      {handle('left')}
      <div className="min-w-0 flex-1">{center}</div>
      {handle('right')}
      <div style={{ width: w.right }} className="min-w-0 shrink-0">{right}</div>
    </div>
  );
}
