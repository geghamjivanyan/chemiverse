import { useEffect, useMemo, useState } from 'react';
import { ChevronLeft, ChevronRight, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { WebBook } from './html';
import { BookPane } from './BookPane';
import { BOOK_TEXT } from './search';
import { HOTSPOTS } from './hotspots';
import { BookSidePanel } from './BookSidePanel';
import { BookNotebook } from './BookNotebook';
import { EMBED_PAGES } from './embeds';
import { useI18n } from '../i18n';

/** Одна страница учебника на левой половине + поиск и переход.
 * Номера показываем со смещением (обложка/титул не считаются): показ № = pdf − offset. */
export function FlipBook({ id, book, title }: { id: string; book: WebBook; title: string }) {
  const { t } = useI18n();
  const offset = book.offset ?? 0;
  const total = book.pages - offset; // печатных страниц
  const [page, setPage] = useState(1); // показанный номер (печатный)
  const [query, setQuery] = useState('');
  const [showRes, setShowRes] = useState(false);
  const [jump, setJump] = useState('1');
  const [selected, setSelected] = useState<string | null>(null);
  const pdfPage = page + offset; // фактическая страница файла
  const pageHotspots = HOTSPOTS[id]?.[pdfPage];
  const embed = EMBED_PAGES[id]?.[pdfPage];

  useEffect(() => { setSelected(null); }, [page]);
  const go = (d: number) => setPage((p) => Math.min(total, Math.max(1, p + d)));
  const goPage = (n: number) => { setPage(Math.min(total, Math.max(1, n))); setShowRes(false); };

  useEffect(() => { setJump(String(page)); }, [page]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.target as HTMLElement)?.tagName === 'INPUT') return;
      if (e.key === 'ArrowRight') go(1);
      if (e.key === 'ArrowLeft') go(-1);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [total]);

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    const text = BOOK_TEXT[id];
    if (q.length < 2 || !text) return [];
    const out: { page: number; snippet: string }[] = [];
    text.forEach((t, i) => {
      const disp = i + 1 - offset; // печатный номер этой PDF-страницы
      if (disp < 1) return;
      const pos = t.toLowerCase().indexOf(q);
      if (pos >= 0) {
        const start = Math.max(0, pos - 28);
        out.push({ page: disp, snippet: (start > 0 ? '…' : '') + t.slice(start, pos + q.length + 44).trim() + '…' });
      }
    });
    return out.slice(0, 50);
  }, [query, id, offset]);

  return (
    <div className="flex h-full flex-col">
      <div className="mb-2 flex items-center gap-2">
        <div className="relative w-72">
          <Search className="pointer-events-none absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <input
            value={query}
            onChange={(e) => { setQuery(e.target.value); setShowRes(true); }}
            onFocus={() => setShowRes(true)}
            placeholder={t.bookSearch}
            className="h-9 w-full rounded-md border bg-background pl-8 pr-3 text-sm outline-none focus:ring-1 focus:ring-ring"
          />
          {showRes && results.length > 0 && (
            <div className="absolute left-0 right-0 top-10 z-40 max-h-80 overflow-auto rounded-md border bg-popover p-1 shadow-xl">
              <div className="px-2 py-1 text-xs text-muted-foreground">Найдено: {results.length}</div>
              {results.map((r, i) => (
                <button key={i} onMouseDown={(e) => { e.preventDefault(); goPage(r.page); }}
                  className="flex w-full gap-2 rounded px-2 py-1.5 text-left text-sm hover:bg-accent">
                  <span className="shrink-0 font-mono text-xs text-muted-foreground">с.{r.page}</span>
                  <span className="line-clamp-2 text-foreground/80">{r.snippet}</span>
                </button>
              ))}
            </div>
          )}
        </div>
        <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
          <span>{t.nbPage}</span>
          <input
            value={jump}
            onChange={(e) => setJump(e.target.value.replace(/[^0-9]/g, ''))}
            onKeyDown={(e) => { if (e.key === 'Enter') goPage(Number(jump) || 1); }}
            onBlur={() => goPage(Number(jump) || page)}
            className="h-8 w-14 rounded-md border bg-background px-2 text-center font-mono text-foreground outline-none focus:ring-1 focus:ring-ring"
          />
          <span>/ {total}</span>
        </div>
      </div>

      <div className="grid min-h-0 flex-1 grid-cols-2 gap-4" onClick={() => setShowRes(false)}>
        <div className="flex min-h-0 flex-col">
          <div className="min-h-0 flex-1">
            <BookPane base={book.base} page={pdfPage} title={title} words={pageHotspots?.words} regions={pageHotspots?.regions} embedTable={embed?.kind === 'periodic-table' ? { ...embed.region, ...embed.grid } : undefined} onHotspot={setSelected} />
          </div>
          <div className="mt-2 flex items-center justify-center gap-3">
            <Button variant="outline" size="sm" onClick={() => go(-1)} disabled={page <= 1}><ChevronLeft className="size-4" /></Button>
            <span className="min-w-20 text-center font-mono text-sm tabular-nums text-muted-foreground">{page} / {total}</span>
            <Button variant="outline" size="sm" onClick={() => go(1)} disabled={page >= total}><ChevronRight className="size-4" /></Button>
          </div>
        </div>
        {selected ? (
          <BookSidePanel matKey={selected} onClose={() => setSelected(null)} />
        ) : (
          <BookNotebook bookId={id} page={page} onJump={goPage} />
        )}
      </div>
    </div>
  );
}
