import { useEffect, useMemo, useState } from 'react';
import { ChevronLeft, ChevronRight, Search, LayoutDashboard, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { WebBook } from '../books/html';
import { BookPane } from '../books/BookPane';
import { BOOK_TEXT } from '../books/search';
import { HOTSPOTS } from '../books/hotspots';
import { EMBED_PAGES } from '../books/embeds';
import { BookNotebook } from '../books/BookNotebook';
import { KnowledgePanel } from './knowledge/KnowledgePanel';
import { resolveByMat } from './knowledge/store';
import { StudyHub } from './StudyHub';
import { ResizablePanes } from './ResizablePanes';
import { LearningCard } from './LearningCard';
import { loadActivity, logEvent, type ActivityEvent } from './activity';
import type { Confidence, LearningBlock } from './model';
import {
  getLessons, loadState, saveState, firstIncomplete, blockById, readingIdsOnPage,
  lessonOf, filteredBlocks, adjacentIn, loadActive, saveActive, READER2_CONFIGS,
  type ProgressState, type StudyFilter,
} from './store';

// id контента (текст/хотспоты/эмбеды) берётся из конфига учебника; для 7.2 это «chemistry-7».
const contentOf = (readerId: string) => READER2_CONFIGS[readerId]?.bookId ?? 'chemistry-7';

export function Reader2({ id, book, title }: { id: string; book: WebBook; title: string }) {
  const CONTENT = contentOf(id);
  const offset = book.offset ?? 0;
  const total = book.pages - offset;
  const [page, setPage] = useState(1);
  const [query, setQuery] = useState('');
  const [showRes, setShowRes] = useState(false);
  const [jump, setJump] = useState('1');
  const [showDash, setShowDash] = useState(false);
  const [progress, setProgress] = useState<ProgressState>(() => loadState(id));
  const [activity, setActivity] = useState<ActivityEvent[]>(() => loadActivity(id));
  const log = (kind: ActivityEvent['kind'], refId: string, refType: ActivityEvent['refType'], label?: string) => setActivity(logEvent(id, kind, refId, refType, label));
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [knowledgeEntityId, setKnowledgeEntityId] = useState<string | null>(null);
  const [filter, setFilter] = useState<StudyFilter>('all');
  const [isWide, setIsWide] = useState(() => typeof window !== 'undefined' && window.matchMedia('(min-width: 1280px)').matches);
  useEffect(() => {
    const mq = window.matchMedia('(min-width: 1280px)');
    const on = () => setIsWide(mq.matches);
    mq.addEventListener('change', on);
    return () => mq.removeEventListener('change', on);
  }, []);
  const pdfPage = page + offset;
  const pageHotspots = HOTSPOTS[CONTENT]?.[pdfPage];
  const embed = EMBED_PAGES[CONTENT]?.[pdfPage];

  const lessons = useMemo(() => getLessons(progress, id), [progress, id]);
  const selectedBlock = useMemo(() => (selectedId ? blockById(lessons, selectedId) : null), [lessons, selectedId]);
  const selLesson = useMemo(() => (selectedId ? lessonOf(lessons, selectedId) : null), [lessons, selectedId]);
  const adj = useMemo(() => (selectedId ? adjacentIn(filteredBlocks(lessons, filter), selectedId) : { prev: null, next: null }), [lessons, selectedId, filter]);

  const update = (fn: (s: ProgressState) => ProgressState) => setProgress((prev) => { const next = fn(prev); saveState(id, next); return next; });
  const patch = (bid: string, p: Partial<ProgressState[string]>) => update((s) => ({ ...s, [bid]: { ...s[bid], ...p } }));
  const toggleComplete = (bid: string) => { const will = !progress[bid]?.completed; update((s) => ({ ...s, [bid]: { ...s[bid], completed: will } })); if (will) log('complete', bid, 'block', blockById(lessons, bid)?.title); };
  const toggleFavorite = (bid: string) => { const will = !progress[bid]?.favorite; update((s) => ({ ...s, [bid]: { ...s[bid], favorite: will } })); if (will) log('favorite', bid, 'block', blockById(lessons, bid)?.title); };
  const setConfidence = (bid: string, c: Confidence | undefined) => update((s) => ({ ...s, [bid]: { ...s[bid], confidence: c } }));

  const go = (d: number) => setPage((p) => Math.min(total, Math.max(1, p + d)));
  const goPage = (n: number) => { setPage(Math.min(total, Math.max(1, n))); setShowRes(false); setShowDash(false); };

  const navigateEntity = (entId: string) => { setKnowledgeEntityId(entId); setSelectedId(null); log('entity', entId, 'entity'); };
  // клик по keyword в книге → режим знаний (Knowledge Entity)
  const onHotspot = (matKey: string) => { const eid = resolveByMat(matKey); if (eid) navigateEntity(eid); };
  // открыть блок: выбрать + проскроллить к нему (перейти на его страницу-локацию)
  const openBlock = (block: LearningBlock) => {
    setSelectedId(block.id);
    setKnowledgeEntityId(null);
    log('view', block.id, 'block', block.title);
    if (block.type === 'keyword' && !block.completed) { patch(block.id, { completed: true }); log('complete', block.id, 'block', block.title); }
    goPage(block.page);
  };
  const openLesson = (lessonId: string) => { const l = lessons.find((x) => x.id === lessonId); const first = l?.learningBlocks[0]; if (first) openBlock(first); };
  const continueLearning = () => { const n = firstIncomplete(lessons); if (n) openBlock(n); };

  // persist «continue position» (активный блок)
  useEffect(() => { saveActive(id, selectedId); }, [id, selectedId]);

  // авто-завершение reading по факту посещения страницы
  useEffect(() => {
    const cur = loadState(id);
    const ids = readingIdsOnPage(page, id).filter((i) => !cur[i]?.completed);
    if (!ids.length) return;
    update((s) => { const n = { ...s }; for (const i of ids) n[i] = { ...n[i], completed: true }; return n; });
    for (const i of ids) log('complete', i, 'block');
  }, [page, id]);

  // при открытии: восстановить активный блок (если не завершён), иначе — первый незавершённый (мягко)
  useEffect(() => {
    const ls = getLessons(loadState(id), id);
    const active = loadActive(id);
    const flat = ls.flatMap((l) => l.learningBlocks);
    const target = (active && flat.find((b) => b.id === active && !b.completed)) || firstIncomplete(ls);
    if (target) setSelectedId(target.id);
  }, [id]);

  useEffect(() => { setJump(String(page)); }, [page]);
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const tag = (e.target as HTMLElement)?.tagName;
      if (tag === 'INPUT' || tag === 'TEXTAREA') return;
      if (e.key === 'ArrowRight') go(1);
      if (e.key === 'ArrowLeft') go(-1);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [total]);

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    const text = BOOK_TEXT[CONTENT];
    if (q.length < 2 || !text) return [];
    const out: { page: number; snippet: string }[] = [];
    text.forEach((tx, i) => {
      const dp = i + 1 - offset;
      if (dp < 1) return;
      const pos = tx.toLowerCase().indexOf(q);
      if (pos >= 0) { const start = Math.max(0, pos - 28); out.push({ page: dp, snippet: (start > 0 ? '…' : '') + tx.slice(start, pos + q.length + 44).trim() + '…' }); }
    });
    return out.slice(0, 50);
  }, [query, offset]);

  const dashProps = { lessons, activity, selectedId, filter, setFilter, onOpenBlock: openBlock, onContinue: continueLearning, onOpenLesson: openLesson, onNavigateEntity: navigateEntity };

  const bookPane = (
    <div className="flex h-full min-h-0 flex-col">
      <div className="min-h-0 flex-1">
        <BookPane base={book.base} page={pdfPage} title={title} words={pageHotspots?.words} regions={pageHotspots?.regions}
          embedTable={embed?.kind === 'periodic-table' ? { ...embed.region, ...embed.grid } : undefined} onHotspot={onHotspot} />
      </div>
      <div className="mt-2 flex items-center justify-center gap-3">
        <Button variant="outline" size="sm" onClick={() => go(-1)} disabled={page <= 1}><ChevronLeft className="size-4" /></Button>
        <span className="min-w-20 text-center font-mono text-sm tabular-nums text-muted-foreground">{page} / {total}</span>
        <Button variant="outline" size="sm" onClick={() => go(1)} disabled={page >= total}><ChevronRight className="size-4" /></Button>
      </div>
    </div>
  );
  const rightPanel = knowledgeEntityId ? (
    <KnowledgePanel entityId={knowledgeEntityId} lessons={lessons} onNavigate={navigateEntity} onOpenBlock={openBlock} onOpenLesson={openLesson} onClose={() => setKnowledgeEntityId(null)} />
  ) : selectedBlock ? (
    <LearningCard key={selectedBlock.id} block={selectedBlock} lessonTitle={selLesson?.title}
      onToggleComplete={() => toggleComplete(selectedBlock.id)} onToggleFavorite={() => toggleFavorite(selectedBlock.id)}
      onNote={(text) => { patch(selectedBlock.id, { note: text }); if (text.trim()) log('note', selectedBlock.id, 'block', selectedBlock.title); }} onConfidence={(c) => setConfidence(selectedBlock.id, c)} onOpenPage={() => goPage(selectedBlock.page)}
      onOpenConcept={selectedBlock.matKey ? () => navigateEntity(resolveByMat(selectedBlock.matKey!) ?? '') : undefined}
      onPrev={() => adj.prev && openBlock(adj.prev)} onNext={() => adj.next && openBlock(adj.next)}
      hasPrev={!!adj.prev} hasNext={!!adj.next} onClose={() => setSelectedId(null)} />
  ) : (
    <BookNotebook bookId={id} page={page} onJump={goPage} />
  );

  return (
    <div className="flex h-full flex-col">
      <div className="mb-2 flex items-center gap-2">
        <Button variant="outline" size="sm" className="xl:hidden" onClick={() => setShowDash(true)}><LayoutDashboard className="size-4" /></Button>
        <div className="relative w-64">
          <Search className="pointer-events-none absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <input value={query} onChange={(e) => { setQuery(e.target.value); setShowRes(true); }} onFocus={() => setShowRes(true)}
            placeholder="Որոնել գրքում…" className="h-9 w-full rounded-md border bg-background pl-8 pr-3 text-sm outline-none focus:ring-1 focus:ring-ring" />
          {showRes && results.length > 0 && (
            <div className="absolute left-0 right-0 top-10 z-40 max-h-80 overflow-auto rounded-md border bg-popover p-1 shadow-xl">
              <div className="px-2 py-1 text-xs text-muted-foreground">Գտնվեց՝ {results.length}</div>
              {results.map((r, i) => (
                <button key={i} onMouseDown={(e) => { e.preventDefault(); goPage(r.page); }} className="flex w-full gap-2 rounded px-2 py-1.5 text-left text-sm hover:bg-accent">
                  <span className="shrink-0 font-mono text-xs text-muted-foreground">էջ {r.page}</span>
                  <span className="line-clamp-2 text-foreground/80">{r.snippet}</span>
                </button>
              ))}
            </div>
          )}
        </div>
        <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
          <span>Էջ</span>
          <input value={jump} onChange={(e) => setJump(e.target.value.replace(/[^0-9]/g, ''))}
            onKeyDown={(e) => { if (e.key === 'Enter') goPage(Number(jump) || 1); }} onBlur={() => goPage(Number(jump) || page)}
            className="h-8 w-14 rounded-md border bg-background px-2 text-center font-mono text-foreground outline-none focus:ring-1 focus:ring-ring" />
          <span>/ {total}</span>
        </div>
        <span className="ml-auto rounded bg-primary/15 px-2 py-0.5 text-xs font-medium text-primary">7.2 · փորձարարական</span>
      </div>

      <div className="min-h-0 flex-1" onClick={() => setShowRes(false)}>
        {isWide ? (
          <ResizablePanes className="h-full" storageKey={`panes:${id}`}
            left={<StudyHub {...dashProps} />} center={bookPane} right={rightPanel}
            leftCfg={{ default: 360, min: 300, max: 650 }} rightCfg={{ default: 360, min: 350, max: 800 }} centerMin={500} />
        ) : (
          <div className="grid h-full min-h-0 grid-cols-2 gap-4">{bookPane}{rightPanel}</div>
        )}
      </div>

      {showDash && (
        <div className="fixed inset-0 z-50 xl:hidden" onClick={() => setShowDash(false)}>
          <div className="absolute inset-0 bg-black/50" />
          <div className="absolute left-0 top-0 h-full w-72 max-w-[85%] bg-background p-2 shadow-xl" onClick={(e) => e.stopPropagation()}>
            <div className="mb-1 flex justify-end"><Button variant="ghost" size="sm" onClick={() => setShowDash(false)}><X className="size-4" /></Button></div>
            <div className="h-[calc(100%-2.5rem)]"><StudyHub {...dashProps} /></div>
          </div>
        </div>
      )}
    </div>
  );
}
