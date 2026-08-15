import { useEffect, useMemo, useState } from 'react';
import type { CSSProperties } from 'react';
import { Link } from 'react-router-dom';
import { elements } from '@chemverse/shared';
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
import { CATEGORY_COLORS } from '../periodic/colors';
import { MoleculeCanvas } from '../scene/MoleculeCanvas';
import { Formula } from '../lab/Formula';
import { fetchMolecule, moleculeName, type ApiMolecule } from '../lab/api';
import { useI18n } from '../i18n';

interface MolResult {
  cid: number;
  formula: string;
  name: string | null;
  name_ru: string | null;
  name_hy: string | null;
}

interface SubResult {
  qid: string;
  name_en: string | null;
  name_ru: string | null;
  name_hy: string | null;
  formula: string | null;
}

export function SearchPage() {
  const { t, locale } = useI18n();
  const [q, setQ] = useState('');
  const [mols, setMols] = useState<MolResult[]>([]);
  const [subs, setSubs] = useState<SubResult[]>([]);
  const [open, setOpen] = useState<ApiMolecule | null>(null);

  const els = useMemo(() => {
    const s = q.trim().toLowerCase();
    if (s.length < 1) return [];
    return elements
      .filter((e) => e.symbol.toLowerCase().startsWith(s) || String(e.z) === s || Object.values(e.names).some((n) => n.toLowerCase().includes(s)))
      .slice(0, 12);
  }, [q]);

  useEffect(() => {
    const s = q.trim();
    if (s.length < 2) {
      setMols([]);
      setSubs([]);
      return;
    }
    const ctrl = new AbortController();
    const id = setTimeout(() => {
      fetch(`/api/substances/search?q=${encodeURIComponent(s)}`, { signal: ctrl.signal })
        .then((r) => r.json())
        .then(setSubs)
        .catch(() => {});
      fetch(`/api/molecules/search?q=${encodeURIComponent(s)}`, { signal: ctrl.signal })
        .then((r) => r.json())
        .then(setMols)
        .catch(() => {});
    }, 200);
    return () => {
      clearTimeout(id);
      ctrl.abort();
    };
  }, [q]);

  const molName = (m: MolResult) =>
    locale === 'ru' && m.name_ru ? m.name_ru : locale === 'hy' && m.name_hy ? m.name_hy : m.name ?? m.formula;

  const openMol = async (formula: string) => {
    const m = await fetchMolecule(formula);
    if (m) setOpen(m);
  };

  const subName = (s: SubResult) =>
    (locale === 'ru' ? s.name_ru : locale === 'hy' ? s.name_hy : null) ?? s.name_en ?? s.formula ?? s.qid;
  const showNothing = q.trim().length >= 2 && els.length === 0 && mols.length === 0 && subs.length === 0;

  return (
    <div className="mx-auto w-full max-w-2xl px-6 py-8">
      <div className="relative">
        <Search className="pointer-events-none absolute left-3 top-1/2 size-5 -translate-y-1/2 text-muted-foreground" />
        <Input autoFocus value={q} onChange={(e) => setQ(e.target.value)} placeholder={t.searchPlaceholder} className="h-12 pl-10 text-base" />
      </div>

      {els.length > 0 && (
        <section className="mt-6">
          <div className="mb-2 text-xs font-medium uppercase tracking-wide text-muted-foreground">{t.searchElements}</div>
          <div className="grid gap-1">
            {els.map((e) => {
              const c = CATEGORY_COLORS[e.category];
              return (
                <Link key={e.z} to={`/app/element/${e.symbol}`} className="flex items-center gap-3 rounded-lg px-2 py-2 hover:bg-accent">
                  <span className="flex size-9 items-center justify-center rounded-md border text-sm font-bold" style={{ borderColor: `color-mix(in srgb, ${c} 45%, transparent)`, background: `color-mix(in srgb, ${c} 18%, transparent)`, color: c } as CSSProperties}>
                    {e.symbol}
                  </span>
                  <span className="flex-1">{e.names[locale]}</span>
                  <span className="font-mono text-sm text-muted-foreground">{e.z}</span>
                </Link>
              );
            })}
          </div>
        </section>
      )}

      {subs.length > 0 && (
        <section className="mt-6">
          <div className="mb-2 text-xs font-medium uppercase tracking-wide text-muted-foreground">{t.searchSubstances}</div>
          <div className="grid gap-1">
            {subs.map((s) => (
              <Link key={s.qid} to={`/app/substance/${s.qid}`} className="flex items-center gap-3 rounded-lg px-2 py-2 hover:bg-accent">
                <span className="flex-1">{subName(s)}</span>
                {s.formula && <span className="font-mono text-sm text-muted-foreground">{s.formula}</span>}
              </Link>
            ))}
          </div>
        </section>
      )}

      {mols.length > 0 && (
        <section className="mt-6">
          <div className="mb-2 text-xs font-medium uppercase tracking-wide text-muted-foreground">{t.searchMolecules}</div>
          <div className="grid gap-1">
            {mols.map((m) => (
              <button key={m.cid} onClick={() => openMol(m.formula)} className="flex items-center gap-3 rounded-lg px-2 py-2 text-left hover:bg-accent">
                <span className="font-mono text-base font-semibold text-primary">
                  <Formula f={m.formula} />
                </span>
                <span className="flex-1 truncate">{molName(m)}</span>
              </button>
            ))}
          </div>
        </section>
      )}

      {showNothing && <p className="mt-8 text-center text-sm text-muted-foreground">{t.searchNothing}</p>}

      <Dialog open={!!open} onOpenChange={(o) => !o && setOpen(null)}>
        <DialogContent className="sm:max-w-md">
          {open && (
            <>
              <MoleculeCanvas molecule={open.geometry} />
              <div className="text-center">
                <DialogTitle className="text-2xl font-bold">
                  <Formula f={open.formula} />
                </DialogTitle>
                <div className="mt-1">{moleculeName(open, locale)}</div>
                {open.name && moleculeName(open, locale) !== open.name && <div className="text-xs text-muted-foreground">{open.name}</div>}
                <div className="mt-1 font-mono text-xs text-muted-foreground">PubChem CID {open.cid} · {open.geometry.atoms.length} {t.atoms}</div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
