import { useState } from 'react';
import { Trophy, Lock } from 'lucide-react';
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
import { cn } from '@/lib/utils';
import { MoleculeCanvas } from '../scene/MoleculeCanvas';
import { Formula } from '../lab/Formula';
import { fetchMolecule, moleculeName, type ApiMolecule } from '../lab/api';
import { useI18n } from '../i18n';
import { useBench } from './BenchContext';

const MILESTONES = [1, 5, 10, 25, 50, 100];

export function NotebookPage() {
  const { t, locale } = useI18n();
  const { discovered } = useBench();
  const [open, setOpen] = useState<ApiMolecule | null>(null);
  const n = discovered.size;
  const list = [...discovered].sort();

  const next = MILESTONES.find((m) => m > n) ?? null;
  const prev = [...MILESTONES].reverse().find((m) => m <= n) ?? 0;
  const pct = next ? Math.round(((n - prev) / (next - prev)) * 100) : 100;

  const openMol = async (formula: string) => {
    const m = await fetchMolecule(formula);
    if (m) setOpen(m);
  };

  return (
    <div className="mx-auto w-full max-w-3xl px-6 py-8">
      <h2 className="text-2xl font-semibold tracking-tight">{t.navNotebook}</h2>

      {/* прогресс */}
      <div className="mt-4 rounded-xl border bg-card p-4">
        <div className="flex items-baseline justify-between">
          <span className="text-sm text-muted-foreground">{t.moleculesOpened}</span>
          <span className="font-mono text-2xl font-bold">{n}</span>
        </div>
        {next && (
          <>
            <div className="mt-3 h-2 overflow-hidden rounded-full bg-secondary">
              <div className="h-full rounded-full bg-primary transition-all" style={{ width: `${pct}%` }} />
            </div>
            <div className="mt-1 text-right font-mono text-xs text-muted-foreground">{n} / {next}</div>
          </>
        )}
      </div>

      {/* достижения */}
      <section className="mt-6">
        <div className="mb-2 text-xs font-medium uppercase tracking-wide text-muted-foreground">{t.achievements}</div>
        <div className="flex flex-wrap gap-2">
          {MILESTONES.map((m) => {
            const got = n >= m;
            return (
              <div
                key={m}
                className={cn(
                  'flex w-20 flex-col items-center gap-1 rounded-xl border p-3 text-center',
                  got ? 'border-amber-500/40 bg-amber-500/10' : 'opacity-50',
                )}
              >
                {got ? <Trophy className="size-5 text-amber-400" /> : <Lock className="size-5 text-muted-foreground" />}
                <span className="font-mono text-sm font-bold">{m}</span>
              </div>
            );
          })}
        </div>
      </section>

      {/* коллекция */}
      <section className="mt-6">
        <div className="mb-2 text-xs font-medium uppercase tracking-wide text-muted-foreground">{t.navNotebook}</div>
        {list.length === 0 ? (
          <p className="text-sm text-muted-foreground">{t.labEmpty}</p>
        ) : (
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-4">
            {list.map((f) => (
              <button key={f} onClick={() => openMol(f)} className="rounded-lg border bg-card px-3 py-3 text-center font-mono text-lg font-semibold transition-colors hover:bg-accent">
                <Formula f={f} />
              </button>
            ))}
          </div>
        )}
      </section>

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
