import { useCallback, useRef, useState } from 'react';
import { Bold, Italic, Underline, X } from 'lucide-react';
import { elements } from '@chemverse/shared';
import { GLOBAL_WORDS } from './dictionary';

const COLORS = ['#dc2626', '#16a34a', '#2563eb', '#9333ea', '#ea580c'];
// стиль = (css-свойство, значение). Жирный — через text-shadow (шрифт pdf2htmlEX одной насыщенности).
const BOLD = { prop: 'text-shadow', val: '0.5px 0 currentColor, -0.5px 0 currentColor, 0 0.5px currentColor, 0 -0.5px currentColor' };
const ITALIC = { prop: 'font-style', val: 'italic' };
const UNDERLINE = { prop: 'text-decoration', val: 'underline' };

type Mark = { ti: number; cs: number; len: number; prop: string; val: string };
const keyFor = (base: string, page: number) => `mk:${base}:${page}`;
const load = (k: string): Mark[] => { try { return JSON.parse(localStorage.getItem(k) || '[]'); } catch { return []; } };
const save = (k: string, m: Mark[]) => localStorage.setItem(k, JSON.stringify(m));

function charOffset(doc: Document, block: Element, container: Node, offset: number): number {
  const r = doc.createRange();
  r.selectNodeContents(block);
  r.setEnd(container, offset);
  return r.toString().length;
}
function locate(doc: Document, block: Element, target: number): [Node, number] {
  const w = doc.createTreeWalker(block, NodeFilter.SHOW_TEXT);
  let pos = 0, node: Node | null = null, last: Node | null = null;
  while ((node = w.nextNode())) {
    last = node;
    const len = node.nodeValue!.length;
    if (pos + len >= target) return [node, target - pos];
    pos += len;
  }
  return [last ?? block, last ? last.nodeValue!.length : 0];
}
function wrapRange(doc: Document, block: Element, cs: number, ce: number, prop: string, val: string) {
  if (ce <= cs) return;
  const [sn, so] = locate(doc, block, cs);
  const [en, eo] = locate(doc, block, ce);
  const r = doc.createRange();
  r.setStart(sn, so); r.setEnd(en, eo);
  const span = doc.createElement('span');
  span.className = 'umk';
  span.style.setProperty(prop, val, 'important');
  try { r.surroundContents(span); } catch { const f = r.extractContents(); span.appendChild(f); r.insertNode(span); }
}
function clearMarks(doc: Document) {
  doc.querySelectorAll<HTMLElement>('.umk').forEach((span) => {
    const p = span.parentNode!;
    while (span.firstChild) p.insertBefore(span.firstChild, span);
    p.removeChild(span);
    (p as Element).normalize?.();
  });
}

/** Страница книги: копия PDF + порядок чтения + Word-панель (форматирование строго по выделению, с тогглом). */
export function BookPane({ base, page, title, words, regions, embedTable, onHotspot }: {
  base: string; page: number; title: string;
  words?: { text: string; key: string }[];
  regions?: { x: number; y: number; w: number; h: number; key: string }[];
  embedTable?: { x: number; y: number; w: number; h: number; padT: number; padL: number; padR: number; padB: number; gap: number };
  onHotspot?: (key: string) => void;
}) {
  const frameRef = useRef<HTMLIFrameElement>(null);
  const docRef = useRef<Document | null>(null);
  const marksRef = useRef<Mark[]>([]);
  const pendingRef = useRef<{ ti: number; cs: number; ce: number }[] | null>(null);
  const [bar, setBar] = useState<{ left: number; top: number } | null>(null);

  const render = useCallback(() => {
    const doc = docRef.current; if (!doc) return;
    clearMarks(doc);
    const ts = [...doc.querySelectorAll<HTMLElement>('.t')];
    for (const m of marksRef.current) { const block = ts[m.ti]; if (block) wrapRange(doc, block, m.cs, m.cs + m.len, m.prop, m.val); }
  }, []);

  const onLoad = useCallback(() => {
    const frame = frameRef.current;
    const doc = frame?.contentDocument;
    const win = frame?.contentWindow;
    if (!frame || !doc || !win) return;
    docRef.current = doc;
    let tries = 0;
    const setup = () => {
      const ts = [...doc.querySelectorAll<HTMLElement>('.t')];
      if (!ts.length) { if (tries++ < 30) setTimeout(setup, 100); return; }
      ts.sort((a, b) => {
        const ra = a.getBoundingClientRect(), rb = b.getBoundingClientRect();
        return Math.abs(ra.top - rb.top) > 6 ? ra.top - rb.top : ra.left - rb.left;
      });
      const par = ts[0]?.parentElement;
      if (par) ts.forEach((t) => par.appendChild(t));
      marksRef.current = load(keyFor(base, page));
      render();

      // кликабельные ячейки поверх книжной таблицы (внутри .pf — едут с прокруткой)
      const pfT = doc.querySelector<HTMLElement>('.pf');
      if (pfT && embedTable) {
        pfT.style.position = pfT.style.position || 'relative';
        const { x, y, w, h, padT, padL, padR, padB, gap } = embedTable;
        const host = doc.createElement('div');
        host.style.cssText = `position:absolute;left:${(x + padL) * 100}%;top:${(y + padT) * 100}%;width:${(w - padL - padR) * 100}%;height:${(h - padT - padB) * 100}%;display:grid;grid-template-columns:repeat(18,1fr);grid-template-rows:repeat(7,1fr) ${gap}fr repeat(2,1fr);z-index:58`;
        for (const el of elements) {
          const cell = doc.createElement('div');
          cell.style.cssText = `grid-column:${el.xpos};grid-row:${el.ypos};cursor:pointer;border-radius:3px;transition:background .1s,box-shadow .1s`;
          cell.title = el.symbol;
          cell.onmouseenter = () => { cell.style.background = 'rgba(54,227,255,.28)'; cell.style.boxShadow = 'inset 0 0 0 2px rgba(54,227,255,.7)'; };
          cell.onmouseleave = () => { cell.style.background = ''; cell.style.boxShadow = ''; };
          cell.onclick = (e) => { e.stopPropagation(); onHotspot?.(el.symbol); };
          host.appendChild(cell);
        }
        pfT.appendChild(host);
      }

      // зоны-клики поверх рисунков (доли страницы → оверлей на .pf)
      const pf = doc.querySelector<HTMLElement>('.pf');
      if (pf && regions?.length) {
        pf.style.position = pf.style.position || 'relative';
        for (const reg of regions) {
          const d = doc.createElement('div');
          d.className = 'hotspot-region';
          d.style.cssText = `position:absolute;left:${reg.x * 100}%;top:${reg.y * 100}%;width:${reg.w * 100}%;height:${reg.h * 100}%;z-index:60;cursor:pointer;border-radius:8px;box-shadow:inset 0 0 0 2px rgba(54,227,255,.45);transition:background .12s`;
          d.onmouseenter = () => { d.style.background = 'rgba(54,227,255,.18)'; };
          d.onmouseleave = () => { d.style.background = ''; };
          d.onclick = (e) => { e.stopPropagation(); onHotspot?.(reg.key); };
          pf.appendChild(d);
        }
      }

      // интерактивные слова: глобальный словарь + локальные, на КАЖДОМ абзаце.
      // игнорируем пробелы (в заголовках разрядка «ած խ ա ծին») и регистр; только начало слова.
      const isArmN = (ch?: string) => !!ch && /[a-zա-և]/.test(ch); // буква (арм. или лат.) — для границы слова
      const allWords = [...GLOBAL_WORDS, ...(words ?? [])].map((w) => ({ ...w, norm: w.text.toLowerCase().replace(/\s+/g, '') }));
      for (const cand of [...doc.querySelectorAll<HTMLElement>('.t')]) {
        const orig = cand.textContent || '';
        if (!orig) continue;
        // нормализуем: без пробелов, нижний регистр; map[normIdx] = origIdx
        let norm = '';
        const map: number[] = [];
        for (let i = 0; i < orig.length; i++) { if (!/\s/.test(orig[i]!)) { norm += orig[i]!.toLowerCase(); map.push(i); } }
        for (const h of allWords) {
          const ns = norm.indexOf(h.norm);
          if (ns < 0) continue;
          if (ns > 0 && isArmN(norm[ns - 1])) continue; // не начало слова
          let ne = ns + h.norm.length;
          while (ne < norm.length && isArmN(norm[ne])) ne++;
          const s0 = map[ns]!;
          const e0 = map[ne - 1]! + 1;
          const [sn, so] = locate(doc, cand, s0);
          if ((sn.parentElement as Element | null)?.closest?.('.hotspot')) continue;
          const [en, eo] = locate(doc, cand, e0);
          const r = doc.createRange();
          r.setStart(sn, so); r.setEnd(en, eo);
          const span = doc.createElement('span');
          span.className = 'hotspot';
          span.style.cssText = 'cursor:pointer;background:rgba(54,227,255,.16);border-radius:3px;padding:0 1px';
          try { r.surroundContents(span); } catch { const f = r.extractContents(); span.appendChild(f); r.insertNode(span); }
          span.addEventListener('click', (ev) => {
            if (!win.getSelection()?.isCollapsed) return;
            ev.stopPropagation();
            onHotspot?.(h.key);
          });
        }
      }

      doc.addEventListener('mouseup', () => {
        const sel = win.getSelection();
        if (!sel || sel.isCollapsed || !sel.rangeCount) { setBar(null); return; }
        const range = sel.getRangeAt(0);
        const cur = [...doc.querySelectorAll<HTMLElement>('.t')];
        const hit = cur.map((b, i) => [b, i] as const).filter(([b]) => range.intersectsNode(b));
        if (!hit.length) { setBar(null); return; }
        pendingRef.current = hit.map(([block, ti]) => ({
          ti,
          cs: block.contains(range.startContainer) ? charOffset(doc, block, range.startContainer, range.startOffset) : 0,
          ce: block.contains(range.endContainer) ? charOffset(doc, block, range.endContainer, range.endOffset) : (block.textContent || '').length,
        }));
        const rects = range.getClientRects();
        const first = rects[0]; const fr = frame.getBoundingClientRect();
        if (first) setBar({ left: fr.left + first.left, top: fr.top + first.top - 46 });
      });
    };
    setup();
  }, [base, page, render]);

  // тоггл стиля по выделению: есть пересекающийся такой же стиль → снять; иначе → добавить (цвет — заменить)
  const toggle = (prop: string, val: string) => {
    if (!pendingRef.current) return;
    let marks = marksRef.current;
    for (const { ti, cs, ce } of pendingRef.current) {
      const overlap = marks.filter((m) => m.prop === prop && m.ti === ti && !(m.cs + m.len <= cs || m.cs >= ce));
      if (overlap.length) {
        const sameVal = overlap.some((m) => m.val === val);
        marks = marks.filter((m) => !overlap.includes(m));
        if (!sameVal) marks.push({ ti, cs, len: ce - cs, prop, val });
      } else {
        marks.push({ ti, cs, len: ce - cs, prop, val });
      }
    }
    marksRef.current = marks;
    save(keyFor(base, page), marks);
    render();
  };

  const BtnTip = ({ onClick, title, children }: { onClick: () => void; title: string; children: React.ReactNode }) => (
    <button onMouseDown={(e) => { e.preventDefault(); onClick(); }} title={title}
      className="flex size-7 items-center justify-center rounded text-foreground/80 hover:bg-secondary hover:text-foreground">
      {children}
    </button>
  );

  return (
    <div className="relative h-full">
      <iframe key={page} ref={frameRef} onLoad={onLoad} src={`${base}/p${page}.html`} title={`${title} — ${page}`}
        className="h-full w-full rounded-lg border bg-white" />
      {bar && (
        <div className="fixed z-50 flex items-center gap-0.5 rounded-lg border bg-popover p-1 shadow-xl" style={{ left: bar.left, top: bar.top }}>
          <BtnTip onClick={() => toggle(BOLD.prop, BOLD.val)} title="Жирный"><Bold className="size-4" /></BtnTip>
          <BtnTip onClick={() => toggle(ITALIC.prop, ITALIC.val)} title="Курсив"><Italic className="size-4" /></BtnTip>
          <BtnTip onClick={() => toggle(UNDERLINE.prop, UNDERLINE.val)} title="Подчёркнутый"><Underline className="size-4" /></BtnTip>
          <div className="mx-1 h-5 w-px bg-border" />
          {COLORS.map((c) => (
            <button key={c} onMouseDown={(e) => { e.preventDefault(); toggle('color', c); }} title="Цвет текста"
              className="size-5 rounded-full border border-black/10 hover:scale-110" style={{ background: c }} />
          ))}
          <div className="mx-1 h-5 w-px bg-border" />
          <BtnTip onClick={() => setBar(null)} title="Закрыть"><X className="size-4" /></BtnTip>
        </div>
      )}
    </div>
  );
}
