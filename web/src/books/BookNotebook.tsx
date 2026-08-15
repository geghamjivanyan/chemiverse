import { useEffect, useMemo, useState } from 'react';
import { Plus, Pencil, Trash2, Check, X, CornerUpRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useI18n } from '../i18n';

export interface Note {
  id: string;
  page: number; // печатная страница, на которой создана заметка
  text: string;
  color: string;
  created: number;
  updated: number;
}

const COLORS = ['#eab308', '#22c55e', '#3b82f6', '#ec4899', '#a78bfa']; // жёлт/зел/син/роз/фиол
const keyFor = (b: string) => `nb:${b}`;
const load = (b: string): Note[] => { try { return JSON.parse(localStorage.getItem(keyFor(b)) || '[]'); } catch { return []; } };
const persistTo = (b: string, n: Note[]) => localStorage.setItem(keyFor(b), JSON.stringify(n));
const uid = () => Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
const fmt = (t: number, locale: string) => new Date(t).toLocaleDateString(locale, { day: 'numeric', month: 'short' });

const RULED = { backgroundImage: 'repeating-linear-gradient(to bottom, transparent 0, transparent 33px, rgba(255,255,255,0.07) 33px, rgba(255,255,255,0.07) 34px)' };

/** Рабочая «тетрадь» к книге: заметки с привязкой к странице, цвета, правка, переход на страницу. */
export function BookNotebook({ bookId, page, onJump }: { bookId: string; page: number; onJump: (p: number) => void }) {
  const { t, locale } = useI18n();
  const [notes, setNotes] = useState<Note[]>(() => load(bookId));
  const [scope, setScope] = useState<'all' | 'page'>('all');
  const [draft, setDraft] = useState('');
  const [draftColor, setDraftColor] = useState(COLORS[0]!);
  const [editId, setEditId] = useState<string | null>(null);
  const [editText, setEditText] = useState('');

  useEffect(() => { setNotes(load(bookId)); }, [bookId]);
  const save = (n: Note[]) => { setNotes(n); persistTo(bookId, n); };

  const add = () => {
    const t = draft.trim(); if (!t) return;
    const now = Date.now();
    save([{ id: uid(), page, text: t, color: draftColor, created: now, updated: now }, ...notes]);
    setDraft('');
  };
  const del = (id: string) => save(notes.filter((n) => n.id !== id));
  const setColor = (id: string, c: string) => save(notes.map((n) => (n.id === id ? { ...n, color: c, updated: Date.now() } : n)));
  const saveEdit = () => {
    save(notes.map((n) => (n.id === editId ? { ...n, text: editText.trim() || n.text, updated: Date.now() } : n)));
    setEditId(null);
  };

  const shown = useMemo(() => (scope === 'page' ? notes.filter((n) => n.page === page) : notes), [notes, scope, page]);
  const pageCount = notes.filter((n) => n.page === page).length;

  return (
    <div className="flex h-full min-h-0 flex-col rounded-lg border bg-card/20">
      <div className="flex items-center justify-between gap-2 border-b px-3 py-2">
        <span className="text-sm font-medium">{t.nbTitle} <span className="text-muted-foreground">· {notes.length}</span></span>
        <div className="flex overflow-hidden rounded-md border text-xs">
          <button onClick={() => setScope('all')} className={`px-2 py-1 ${scope === 'all' ? 'bg-secondary text-foreground' : 'text-muted-foreground'}`}>{t.nbAll}</button>
          <button onClick={() => setScope('page')} className={`px-2 py-1 ${scope === 'page' ? 'bg-secondary text-foreground' : 'text-muted-foreground'}`}>{t.nbPage} {page}{pageCount ? ` (${pageCount})` : ''}</button>
        </div>
      </div>

      {/* добавление — привязка к текущей странице */}
      <div className="border-b px-3 py-2">
        <textarea
          value={draft} onChange={(e) => setDraft(e.target.value)}
          onKeyDown={(e) => { if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) add(); }}
          placeholder={`${t.nbPlaceholder} ${page}…  (Ctrl+Enter)`}
          rows={2}
          className="w-full resize-none rounded-md border bg-background px-2 py-1.5 text-sm outline-none focus:ring-1 focus:ring-ring"
        />
        <div className="mt-1.5 flex items-center justify-between">
          <div className="flex gap-1.5">
            {COLORS.map((c) => (
              <button key={c} onClick={() => setDraftColor(c)} title={t.nbColor}
                className={`size-5 rounded-full border transition ${draftColor === c ? 'ring-2 ring-ring ring-offset-1 ring-offset-background' : 'border-black/20'}`}
                style={{ background: c }} />
            ))}
          </div>
          <Button size="sm" className="h-7 gap-1" onClick={add} disabled={!draft.trim()}>
            <Plus className="size-3.5" /> {t.nbAdd}
          </Button>
        </div>
      </div>

      {/* список заметок */}
      <div className="min-h-0 flex-1 space-y-2 overflow-auto p-2" style={RULED}>
        {shown.length === 0 && (
          <div className="grid h-full place-items-center text-center text-sm text-muted-foreground">
            {scope === 'page' ? t.nbEmptyPage : t.nbEmptyAll}
          </div>
        )}
        {shown.map((n) => (
          <div key={n.id} className="rounded-md border bg-card/80 p-2 shadow-sm" style={{ borderLeft: `4px solid ${n.color}` }}>
            {editId === n.id ? (
              <div>
                <textarea value={editText} onChange={(e) => setEditText(e.target.value)} rows={3} autoFocus
                  className="w-full resize-none rounded border bg-background px-2 py-1 text-sm outline-none focus:ring-1 focus:ring-ring" />
                <div className="mt-1 flex justify-end gap-1">
                  <Button size="sm" variant="ghost" className="h-6 px-2" onClick={() => setEditId(null)}><X className="size-3.5" /></Button>
                  <Button size="sm" className="h-6 px-2" onClick={saveEdit}><Check className="size-3.5" /></Button>
                </div>
              </div>
            ) : (
              <>
                <p className="whitespace-pre-wrap break-words text-sm text-foreground/90">{n.text}</p>
                <div className="mt-1.5 flex items-center justify-between gap-2">
                  <button onClick={() => onJump(n.page)} title={t.nbGoto}
                    className="flex items-center gap-1 rounded bg-secondary/60 px-1.5 py-0.5 text-xs text-muted-foreground hover:text-foreground">
                    <CornerUpRight className="size-3" /> {t.nbPage} {n.page}
                  </button>
                  <div className="flex items-center gap-1">
                    {COLORS.map((c) => (
                      <button key={c} onClick={() => setColor(n.id, c)} title={t.nbColor}
                        className={`size-3 rounded-full ${n.color === c ? 'ring-1 ring-ring ring-offset-1 ring-offset-card' : ''}`} style={{ background: c }} />
                    ))}
                    <span className="ml-1 text-[11px] text-muted-foreground">{fmt(n.created, locale)}</span>
                    <button onClick={() => { setEditId(n.id); setEditText(n.text); }} title={t.nbEdit} className="ml-1 text-muted-foreground hover:text-foreground"><Pencil className="size-3.5" /></button>
                    <button onClick={() => del(n.id)} title={t.nbDelete} className="text-muted-foreground hover:text-destructive"><Trash2 className="size-3.5" /></button>
                  </div>
                </div>
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
