import { useEffect, useState } from 'react';
import type { CSSProperties } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { bySymbol } from '@chemverse/shared';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { CATEGORY_COLORS } from '../periodic/colors';
import { MoleculeCanvas } from '../scene/MoleculeCanvas';
import { Formula } from '../lab/Formula';
import { fetchMolecule, type ApiMolecule } from '../lab/api';
import { useI18n } from '../i18n';

interface Substance {
  qid: string;
  name_en: string | null;
  name_ru: string | null;
  name_hy: string | null;
  desc_en: string | null;
  desc_ru: string | null;
  desc_hy: string | null;
  formula: string | null;
}

const SUB = '₀₁₂₃₄₅₆₇₈₉';
function normFormula(f: string | null): string {
  return f ? f.replace(/[₀-₉]/g, (d) => String(SUB.indexOf(d))).replace(/\s/g, '') : '';
}
function parseComp(f: string): [string, number][] {
  const counts: Record<string, number> = {};
  for (const m of f.matchAll(/([A-Z][a-z]?)(\d*)/g)) {
    if (!m[1] || !bySymbol.has(m[1])) continue;
    counts[m[1]] = (counts[m[1]] ?? 0) + (m[2] ? +m[2] : 1);
  }
  return Object.entries(counts);
}

export function SubstancePage() {
  const { qid } = useParams<{ qid: string }>();
  const { t, locale } = useI18n();
  const navigate = useNavigate();
  const [s, setS] = useState<Substance | null | undefined>(undefined);
  const [mol, setMol] = useState<ApiMolecule | null>(null);

  useEffect(() => {
    setS(undefined);
    setMol(null);
    fetch(`/api/substances/${qid}`)
      .then((r) => (r.ok ? r.json() : null))
      .then((data: Substance | null) => {
        setS(data);
        if (data?.formula) fetchMolecule(normFormula(data.formula)).then((m) => setMol(m)).catch(() => {});
      })
      .catch(() => setS(null));
    window.scrollTo(0, 0);
  }, [qid]);

  if (s === undefined) return <div className="flex h-full items-center justify-center text-muted-foreground">…</div>;
  if (s === null)
    return (
      <div className="flex h-full flex-col items-center justify-center gap-3 text-muted-foreground">
        <p>—</p>
        <Button variant="outline" onClick={() => navigate(-1)}>
          <ArrowLeft className="size-4" /> {t.back}
        </Button>
      </div>
    );

  const name = (locale === 'ru' ? s.name_ru : locale === 'hy' ? s.name_hy : null) ?? s.name_en ?? s.formula ?? s.qid;
  const desc = (locale === 'ru' ? s.desc_ru : locale === 'hy' ? s.desc_hy : null) ?? s.desc_en;
  const fNorm = normFormula(s.formula);
  const comp = parseComp(fNorm);

  return (
    <div className="mx-auto w-full max-w-3xl px-5 py-5">
      <Button variant="ghost" size="sm" onClick={() => navigate(-1)} className="-ml-2">
        <ArrowLeft className="size-4" /> {t.back}
      </Button>

      <div className="mt-3 grid gap-6 md:grid-cols-[minmax(0,340px)_1fr]">
        <div>
          <div className="relative h-64 overflow-hidden rounded-xl border bg-card [&_.mol-canvas]:h-full">
            {mol ? (
              <MoleculeCanvas molecule={mol.geometry} />
            ) : (
              <div className="flex h-full items-center justify-center text-4xl font-bold text-muted-foreground">
                {fNorm ? <Formula f={fNorm} /> : '—'}
              </div>
            )}
          </div>
        </div>

        <div>
          <h1 className="text-2xl font-semibold leading-tight">{name}</h1>
          {s.name_en && name !== s.name_en && <div className="text-sm text-muted-foreground">{s.name_en}</div>}
          {fNorm && (
            <div className="mt-2 font-mono text-lg">
              <Formula f={fNorm} />
            </div>
          )}

          {comp.length > 0 && (
            <div className="mt-3 flex flex-wrap gap-1.5">
              {comp.map(([sym, count]) => {
                const e = bySymbol.get(sym)!;
                const c = CATEGORY_COLORS[e.category];
                return (
                  <Link
                    key={sym}
                    to={`/app/element/${sym}`}
                    className="inline-flex items-center gap-1 rounded-md border px-2 py-0.5 text-sm hover:brightness-125"
                    style={{ borderColor: `color-mix(in srgb, ${c} 45%, transparent)`, color: `color-mix(in srgb, ${c} 72%, white)` } as CSSProperties}
                  >
                    {sym}
                    {count > 1 && <b className="text-muted-foreground">×{count}</b>}
                  </Link>
                );
              })}
            </div>
          )}

          {desc && (
            <div className="mt-5">
              <div className="mb-1.5 text-xs font-medium uppercase tracking-wide text-muted-foreground">{t.about}</div>
              <p className="text-sm leading-relaxed text-foreground/90">{desc}</p>
            </div>
          )}

          <a
            href={`https://www.wikidata.org/wiki/${s.qid}`}
            target="_blank"
            rel="noreferrer"
            className="mt-4 inline-block text-xs text-muted-foreground hover:text-foreground"
          >
            Wikidata {s.qid} ↗
          </a>
        </div>
      </div>
    </div>
  );
}
