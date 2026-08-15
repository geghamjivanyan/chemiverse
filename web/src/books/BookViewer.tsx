import { useEffect, useRef, useState } from 'react';
import * as pdfjsLib from 'pdfjs-dist';
import workerUrl from 'pdfjs-dist/build/pdf.worker.min.mjs?url';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

pdfjsLib.GlobalWorkerOptions.workerSrc = workerUrl;

/** Листалка PDF-учебника: рендер страниц PDF.js, навигация, подгон по ширине. */
export function BookViewer({ file }: { file: string }) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const docRef = useRef<pdfjsLib.PDFDocumentProxy | null>(null);
  const renderRef = useRef<pdfjsLib.RenderTask | null>(null);
  const [pages, setPages] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);

  // загрузка документа
  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    const task = pdfjsLib.getDocument(file);
    task.promise.then((pdf) => {
      if (cancelled) { pdf.destroy(); return; }
      docRef.current = pdf;
      setPages(pdf.numPages);
      setPage(1);
      setLoading(false);
    }).catch(() => !cancelled && setLoading(false));
    return () => { cancelled = true; docRef.current?.destroy(); docRef.current = null; };
  }, [file]);

  // рендер текущей страницы
  useEffect(() => {
    const pdf = docRef.current;
    const canvas = canvasRef.current;
    if (!pdf || !canvas || loading) return;
    let cancelled = false;
    (async () => {
      const pg = await pdf.getPage(page);
      if (cancelled) return;
      const dpr = window.devicePixelRatio || 1;
      const avail = (wrapRef.current?.clientWidth ?? 800) - 8;
      const base = pg.getViewport({ scale: 1 });
      const scale = Math.min(2.2, avail / base.width);
      const vp = pg.getViewport({ scale: scale * dpr });
      const ctx = canvas.getContext('2d')!;
      canvas.width = vp.width;
      canvas.height = vp.height;
      canvas.style.width = `${vp.width / dpr}px`;
      canvas.style.height = `${vp.height / dpr}px`;
      renderRef.current?.cancel();
      renderRef.current = pg.render({ canvasContext: ctx, viewport: vp });
      try { await renderRef.current.promise; } catch { /* отменён при смене страницы */ }
    })();
    return () => { cancelled = true; };
  }, [page, loading]);

  const go = (d: number) => setPage((p) => Math.min(pages || 1, Math.max(1, p + d)));

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') go(1);
      if (e.key === 'ArrowLeft') go(-1);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [pages]);

  return (
    <div className="flex h-full flex-col">
      <div ref={wrapRef} className="relative flex-1 overflow-auto rounded-lg border bg-card/40 p-1">
        {loading && <div className="absolute inset-0 grid place-items-center text-muted-foreground">…</div>}
        <canvas ref={canvasRef} className="mx-auto block rounded shadow-lg" />
      </div>
      <div className="mt-3 flex items-center justify-center gap-3">
        <Button variant="outline" size="sm" onClick={() => go(-1)} disabled={page <= 1}>
          <ChevronLeft className="size-4" />
        </Button>
        <span className="min-w-24 text-center font-mono text-sm tabular-nums text-muted-foreground">
          {page} / {pages || '…'}
        </span>
        <Button variant="outline" size="sm" onClick={() => go(1)} disabled={!!pages && page >= pages}>
          <ChevronRight className="size-4" />
        </Button>
      </div>
    </div>
  );
}
