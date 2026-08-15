import { useEffect, useState } from 'react';
import type { CSSProperties } from 'react';
import { byZ, bySymbol, elements, hillFormula } from '@chemverse/shared';
import type { Locale } from '@chemverse/shared';
import { Plus, Minus, Trash2, Check, FlaskConical, Sparkles, Grid3x3, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { cn } from '@/lib/utils';
import { CATEGORY_COLORS } from '../periodic/colors';
import { MoleculeCanvas } from '../scene/MoleculeCanvas';
import { Formula } from '../lab/Formula';
import { fetchMolecule, moleculeName, type ApiMolecule, type MolGeometry } from '../lab/api';
import { useI18n } from '../i18n';
import { useBench } from './BenchContext';
import { ReactionsTab } from './ReactionsTab';

const FREQ = ['H', 'C', 'N', 'O', 'Na', 'Cl', 'S', 'P', 'K', 'Ca', 'Fe', 'Mg'];

function looseGeo(counts: Record<string, number>): MolGeometry {
  const list: number[] = [];
  for (const [s, n] of Object.entries(counts)) {
    const z = bySymbol.get(s)?.z;
    if (z) for (let i = 0; i < n; i++) list.push(z);
  }
  const n = list.length;
  return {
    atoms: list.map((z, i) => {
      const a = (i / Math.max(1, n)) * Math.PI * 2;
      const r = n === 1 ? 0 : 1.7;
      return { z, pos: [Math.cos(a) * r, Math.sin(a) * r * 0.62, 0] as [number, number, number] };
    }),
    bonds: [],
  };
}

function molarMass(geo: MolGeometry): number {
  let m = 0;
  for (const a of geo.atoms) m += byZ.get(a.z)?.mass ?? 0;
  return m;
}

function ElButton({ sym, onAdd }: { sym: string; onAdd: (s: string) => void }) {
  const e = bySymbol.get(sym);
  if (!e) return null;
  const c = CATEGORY_COLORS[e.category];
  return (
    <button
      onClick={() => onAdd(sym)}
      title={e.names.en}
      style={{ borderColor: `color-mix(in srgb, ${c} 50%, transparent)`, background: `color-mix(in srgb, ${c} 18%, transparent)`, color: `color-mix(in srgb, ${c} 74%, white)` } as CSSProperties}
      className="flex aspect-square items-center justify-center rounded-md border text-sm font-bold transition-transform hover:scale-110"
    >
      {sym}
    </button>
  );
}

// полная таблица как палитра — выезжает снизу
function PeriodicPicker({ onAdd, locale }: { onAdd: (s: string) => void; locale: Locale }) {
  return (
    <div className="h-full overflow-auto">
      <div className="mx-auto grid w-full gap-1" style={{ maxWidth: '1160px', gridTemplateColumns: 'repeat(18, minmax(0, 1fr))', gridTemplateRows: 'repeat(7, auto) 10px repeat(2, auto)' }}>
        {elements.map((e) => {
          const c = CATEGORY_COLORS[e.category];
          return (
            <button
              key={e.z}
              onClick={() => onAdd(e.symbol)}
              title={`${e.z} · ${e.names[locale]}`}
              style={{ gridColumn: e.xpos, gridRow: e.ypos, borderColor: `color-mix(in srgb, ${c} 50%, transparent)`, background: `color-mix(in srgb, ${c} 20%, transparent)`, color: `color-mix(in srgb, ${c} 74%, white)` } as CSSProperties}
              className="relative flex aspect-square items-center justify-center rounded-md border text-base font-bold transition-colors hover:z-10 hover:brightness-125"
            >
              <span className="absolute left-1 top-0.5 font-mono text-[9px] font-normal text-muted-foreground">{e.z}</span>
              {e.symbol}
            </button>
          );
        })}
      </div>
    </div>
  );
}

export function LabPage() {
  const { t, locale } = useI18n();
  const { counts, total, addAtom, removeAtom, reset, discovered, addDiscovered } = useBench();
  const [mol, setMol] = useState<ApiMolecule | null>(null);
  const [status, setStatus] = useState<'idle' | 'loading' | 'found' | 'none'>('idle');
  const [tableOpen, setTableOpen] = useState(false);

  const formula = hillFormula(counts);

  useEffect(() => {
    if (!formula) {
      setStatus('idle');
      setMol(null);
      return;
    }
    const ctrl = new AbortController();
    setStatus('loading');
    fetchMolecule(formula, ctrl.signal)
      .then((m) => {
        setMol(m);
        setStatus(m ? 'found' : 'none');
      })
      .catch((e: unknown) => {
        if ((e as Error).name !== 'AbortError') {
          setMol(null);
          setStatus('none');
        }
      });
    return () => ctrl.abort();
  }, [formula]);

  const geo = status === 'found' && mol ? mol.geometry : total > 0 ? looseGeo(counts) : null;
  const isOpened = mol ? discovered.has(mol.formula) : false;

  return (
    <div className="flex h-full flex-col p-4 md:p-6">
      <Tabs defaultValue="sandbox" className="flex min-h-0 flex-1 flex-col">
        <TabsList>
          <TabsTrigger value="sandbox">{t.labSandbox}</TabsTrigger>
          <TabsTrigger value="challenges">{t.labChallenges}</TabsTrigger>
          <TabsTrigger value="reactions">{t.labReactions}</TabsTrigger>
        </TabsList>

        <TabsContent value="sandbox" className="mt-4 flex min-h-0 flex-1 flex-col gap-3">
          {/* рабочая зона: большой стол + панель */}
          <div className={cn('flex min-h-0 gap-3', tableOpen ? 'flex-[3]' : 'flex-1')}>
            <div className="relative min-h-0 flex-1 overflow-hidden rounded-xl border bg-card [&_.mol-canvas]:h-full">
              {geo ? (
                <MoleculeCanvas molecule={geo} />
              ) : (
                <div className="flex h-full flex-col items-center justify-center gap-2 text-muted-foreground">
                  <FlaskConical className="size-12 opacity-40" />
                  <p className="text-sm">{t.labEmpty}</p>
                </div>
              )}
            </div>

            <div className="flex w-72 shrink-0 flex-col gap-3 overflow-y-auto">
              {/* результат */}
              <div className="flex shrink-0 flex-col items-center justify-center rounded-xl border bg-card p-4 text-center">
                {total === 0 && <p className="text-sm text-muted-foreground">{t.labEmpty}</p>}
                {total > 0 && (
                  <>
                    <div className="text-3xl font-bold">
                      <Formula f={formula} />
                    </div>
                    {status === 'loading' && <div className="mt-1 text-sm text-muted-foreground">…</div>}
                    {status === 'found' && mol && (
                      <>
                        <div className="mt-1 text-base">{moleculeName(mol, locale)}</div>
                        {mol.name && moleculeName(mol, locale) !== mol.name && <div className="text-xs text-muted-foreground">{mol.name}</div>}
                        <div className="mt-2 font-mono text-xs text-muted-foreground">
                          {molarMass(mol.geometry).toFixed(2)} g/mol · {mol.geometry.atoms.length} {t.atoms}
                        </div>
                        <div className="mt-3 inline-flex items-center gap-1.5 text-sm font-medium text-emerald-400">
                          <Check className="size-4" /> {t.labReal}
                        </div>
                        <Button className="mt-3" disabled={isOpened} onClick={() => addDiscovered(mol.formula)}>
                          {isOpened ? <><Check className="size-4" /> {t.labAdded}</> : <><Sparkles className="size-4" /> {t.labOpen}</>}
                        </Button>
                      </>
                    )}
                    {status === 'none' && <div className="mt-3 text-sm text-muted-foreground">{t.labNotReal}</div>}
                  </>
                )}
              </div>

              {/* твой набор */}
              {total > 0 && (
                <div className="rounded-xl border bg-card p-3">
                  <div className="flex flex-wrap items-center gap-1.5">
                    {Object.entries(counts).map(([s, n]) => {
                      const c = bySymbol.get(s) ? CATEGORY_COLORS[bySymbol.get(s)!.category] : '#888';
                      return (
                        <span key={s} className="inline-flex items-center gap-1 rounded-md border py-0.5 pl-2 pr-1 text-sm" style={{ borderColor: `color-mix(in srgb, ${c} 40%, transparent)` }}>
                          <span className="font-semibold" style={{ color: `color-mix(in srgb, ${c} 74%, white)` }}>{s}</span>
                          <span className="font-mono text-xs text-muted-foreground">{n}</span>
                          <span className="ml-0.5 flex">
                            <button onClick={() => removeAtom(s)} className="rounded p-0.5 text-muted-foreground hover:text-foreground"><Minus className="size-3.5" /></button>
                            <button onClick={() => addAtom(s)} className="rounded p-0.5 text-muted-foreground hover:text-foreground"><Plus className="size-3.5" /></button>
                          </span>
                        </span>
                      );
                    })}
                  </div>
                  <Button variant="ghost" size="sm" className="mt-2 w-full" onClick={reset}><Trash2 className="size-4" /> {t.reset}</Button>
                </div>
              )}

              {/* частые элементы — всегда под рукой */}
              <div className="rounded-xl border bg-card p-3">
                <div className="mb-1.5 text-xs font-medium uppercase tracking-wide text-muted-foreground">{t.labFrequent}</div>
                <div className="grid grid-cols-6 gap-1.5">
                  {FREQ.map((s) => <ElButton key={s} sym={s} onAdd={addAtom} />)}
                </div>
              </div>

              <div className="text-center text-sm text-muted-foreground">
                <span className="font-mono text-base text-foreground">{discovered.size}</span> {t.moleculesOpened}
              </div>
            </div>
          </div>

          {/* выезжающая таблица элементов */}
          {tableOpen ? (
            <div className="relative min-h-0 flex-[2] rounded-xl border bg-card p-2 animate-in slide-in-from-bottom-4 duration-200">
              <Button variant="ghost" size="icon" className="absolute right-2 top-2 z-10 size-7" onClick={() => setTableOpen(false)}>
                <X className="size-4" />
              </Button>
              <PeriodicPicker onAdd={addAtom} locale={locale} />
            </div>
          ) : (
            <Button variant="outline" className="shrink-0" onClick={() => setTableOpen(true)}>
              <Grid3x3 className="size-4" /> {t.labAllElements}
            </Button>
          )}
        </TabsContent>

        <TabsContent value="challenges" className="mt-4 min-h-0 flex-1">
          <div className="flex h-full flex-col items-center justify-center gap-2 text-muted-foreground">
            <div className="text-4xl opacity-40">🎯</div>
            <h2 className="text-lg font-semibold text-foreground">{t.labChallenges}</h2>
            <p className="text-sm">{t.comingSoon}</p>
          </div>
        </TabsContent>
        <TabsContent value="reactions" className="mt-4 min-h-0 flex-1">
          <ReactionsTab />
        </TabsContent>
      </Tabs>
    </div>
  );
}
