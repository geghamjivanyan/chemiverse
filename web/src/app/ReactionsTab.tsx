import { useState } from 'react';
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
import { Formula } from '../lab/Formula';
import { REACTIONS, EFFECTS, type Reaction, type Species } from '../lab/reactions';
import { ReactionPlayer } from './ReactionPlayer';
import { useI18n } from '../i18n';

function Eqn({ sp, big }: { sp: Species[]; big?: boolean }) {
  return (
    <span className={big ? 'text-xl font-bold' : 'font-mono text-sm'}>
      {sp.map((s, i) => (
        <span key={i}>
          {i > 0 && <span className="mx-1.5 text-muted-foreground">+</span>}
          {s.n && s.n > 1 && <span className="text-muted-foreground">{s.n}</span>}
          <Formula f={s.f} />
        </span>
      ))}
    </span>
  );
}

export function ReactionsTab() {
  const { locale } = useI18n();
  const [open, setOpen] = useState<Reaction | null>(null);
  const tr = (o: { en: string; ru: string; hy?: string }) => (locale === 'ru' ? o.ru : locale === 'hy' ? o.hy ?? o.en : o.en);

  return (
    <div className="h-full overflow-auto">
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {REACTIONS.map((r) => {
          const ef = EFFECTS[r.effect];
          return (
            <button key={r.id} onClick={() => setOpen(r)} className="rounded-xl border bg-card p-4 text-left transition-colors hover:bg-accent">
              <div className="flex items-center justify-between gap-2">
                <span className="font-medium">{tr(r.title)}</span>
                <span className="shrink-0 text-base" title={ef[locale]}>{ef.emoji}</span>
              </div>
              <div className="mt-2 flex flex-wrap items-center gap-1">
                <Eqn sp={r.left} />
                <span className="mx-1 text-muted-foreground">→</span>
                <Eqn sp={r.right} />
              </div>
            </button>
          );
        })}
      </div>

      <Dialog open={!!open} onOpenChange={(o) => !o && setOpen(null)}>
        <DialogContent className="sm:max-w-lg">
          {open && (
            <>
              <DialogTitle className="text-center text-lg font-semibold">{tr(open.title)}</DialogTitle>
              <ReactionPlayer reaction={open} />
              <div className="text-center">
                <div className="flex flex-wrap items-center justify-center gap-1">
                  <Eqn sp={open.left} big />
                  <span className="mx-1.5 text-2xl text-muted-foreground">→</span>
                  <Eqn sp={open.right} big />
                </div>
                <div className="mt-2 inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-sm">
                  <span>{EFFECTS[open.effect].emoji}</span> {EFFECTS[open.effect][locale]}
                </div>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{tr(open.desc)}</p>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
