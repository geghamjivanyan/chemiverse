import type { CSSProperties, ReactNode } from 'react';
import { Link } from 'react-router-dom';
import type { Element } from '@chemverse/shared';
import { Maximize2, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { CATEGORY_COLORS } from './colors';
import { useI18n } from '../i18n';
import { AtomCanvas } from '../scene/AtomCanvas';
import type { AtomMode } from '../scene/Atom';

function prettyConfig(cfg: string): ReactNode[] {
  return cfg.split(/\s+/).map((tok, i) => {
    const m = /^([spdf])(\d+)$/i.exec(tok);
    return (
      <span key={i} className="mr-1">
        {m ? (
          <>
            {m[1]}
            <sup>{m[2]}</sup>
          </>
        ) : (
          tok
        )}
      </span>
    );
  });
}

function Row({ label, value }: { label: string; value: ReactNode }) {
  const empty = value === '—' || value == null;
  return (
    <div className="flex items-baseline justify-between gap-3 border-b border-border/60 py-1 text-sm last:border-0">
      <span className="text-muted-foreground">{label}</span>
      <span className={cn('text-right font-mono tabular-nums', empty ? 'text-muted-foreground/50' : 'text-foreground')}>
        {value}
      </span>
    </div>
  );
}

export function ElementDetail({
  element,
  onExpand,
  mode,
  onToggleMode,
}: {
  element: Element | null;
  onExpand: () => void;
  mode: AtomMode;
  onToggleMode: (m: AtomMode) => void;
}) {
  const { t, locale } = useI18n();

  if (!element) {
    return (
      <div className="flex h-full flex-col items-center justify-center rounded-xl border bg-card p-6 text-center text-sm text-muted-foreground">
        <p>{t.detailHint1}</p>
        <p className="mt-1 text-xs">{t.detailHint2}</p>
      </div>
    );
  }

  const color = CATEGORY_COLORS[element.category];
  const oxstates = element.oxidationStates.length
    ? element.oxidationStates
        .slice()
        .sort((a, b) => a - b)
        .map((o) => (o > 0 ? `+${o}` : `${o}`).replace('-', '−'))
        .join(' ')
    : '—';

  return (
    <div className="rounded-xl border bg-card" style={{ '--c': color } as CSSProperties}>
      {/* header */}
      <div className="flex items-center gap-3 px-4 pt-3 pb-2">
        <div
          className="flex size-12 items-center justify-center rounded-lg text-2xl font-bold"
          style={{ color, background: `color-mix(in srgb, ${color} 18%, transparent)`, border: `1px solid color-mix(in srgb, ${color} 45%, transparent)` }}
        >
          {element.symbol}
        </div>
        <div className="min-w-0 flex-1">
          <div className="truncate text-lg font-semibold leading-tight">{element.names[locale]}</div>
          {locale !== 'en' && <div className="truncate text-xs text-muted-foreground">{element.names.en}</div>}
          <span
            className="mt-1 inline-flex items-center gap-1.5 rounded-full border px-2 py-0.5 text-[11px]"
            style={{ borderColor: `color-mix(in srgb, ${color} 40%, transparent)`, color }}
          >
            <span className="size-1.5 rounded-full" style={{ background: color }} />
            {t.categories[element.category]}
          </span>
        </div>
        <div className="self-start font-mono text-sm text-muted-foreground">{element.z}</div>
      </div>

      {/* atom */}
      <div className="relative mx-4 h-64 overflow-hidden rounded-lg border bg-background/40">
        <AtomCanvas element={element} mode={mode} />
        <div className="absolute left-2 top-2 flex rounded-md bg-secondary/80 p-0.5 backdrop-blur">
          {(['bohr', 'orbitals'] as const).map((m) => (
            <button
              key={m}
              onClick={() => onToggleMode(m)}
              className={cn(
                'rounded px-2 py-1 text-xs transition-colors',
                mode === m ? 'bg-background text-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground',
              )}
            >
              {m === 'bohr' ? t.modeBohr : t.modeOrbitals}
            </button>
          ))}
        </div>
        <button
          onClick={onExpand}
          title={t.inspect}
          aria-label={t.inspect}
          className="absolute right-2 top-2 flex size-7 items-center justify-center rounded-md bg-secondary/80 text-muted-foreground backdrop-blur transition-colors hover:text-foreground"
        >
          <Maximize2 className="size-3.5" />
        </button>
      </div>

      <div className="px-4 pb-4 pt-3">
        {/* particles */}
        <div className="grid grid-cols-3 gap-1.5">
          {[
            { n: element.z, label: t.protons, c: '#ff8a8a' },
            { n: element.neutrons, label: t.neutrons, c: 'var(--muted-foreground)' },
            { n: element.z, label: t.electrons, c: '#6cc6ff' },
          ].map((p, i) => (
            <div key={i} className="rounded-lg border bg-background/40 py-1.5 text-center">
              <div className="font-mono text-base font-semibold" style={{ color: p.c }}>
                {p.n}
              </div>
              <div className="text-[11px] text-muted-foreground">{p.label}</div>
            </div>
          ))}
        </div>

        {/* properties */}
        <div className="mt-3">
          <Row label={t.atomicMass} value={`${element.mass} ${t.amu}`} />
          <Row label={t.periodGroup} value={`${element.period} / ${element.group}`} />
          <Row label={t.block} value={`${element.block}${t.blockSuffix}`} />
          <Row label={t.state} value={t.phases[element.phase]} />
          <Row label={t.electronegativity} value={element.electronegativity ?? '—'} />
          <Row label={t.configuration} value={<span className="font-mono">{prettyConfig(element.electronConfig)}</span>} />
          <Row
            label={t.shells}
            value={
              <span className="inline-flex flex-wrap justify-end gap-1">
                {element.shells.map((n, i) => (
                  <span key={i} className="rounded bg-secondary px-1.5 text-xs">
                    {n}
                  </span>
                ))}
              </span>
            }
          />
          <Row label={t.valences} value={element.valence.length ? element.valence.join(', ') : '—'} />
          <Row label={t.oxidationStates} value={oxstates} />
          <Row label={t.density} value={element.density != null ? `${element.density} g/cm³` : '—'} />
          <Row label={t.melting} value={element.melt != null ? `${element.melt} K` : '—'} />
          <Row label={t.boiling} value={element.boil != null ? `${element.boil} K` : '—'} />
          <Row label={t.ionization} value={element.ionizationEnergies[0] != null ? `${element.ionizationEnergies[0]} kJ/mol` : '—'} />
          <Row label={t.atomicRadius} value={element.atomicRadius != null ? `${element.atomicRadius} pm` : '—'} />
          {element.discoveredBy && <Row label={t.discoveredBy} value={element.discoveredBy} />}
          {element.yearDiscovered && <Row label={t.yearDiscovered} value={element.yearDiscovered} />}
        </div>

        {element.isotopes.length > 0 && (
          <div className="mt-4">
            <div className="mb-2 text-xs font-medium uppercase tracking-wide text-muted-foreground">{t.isotopes}</div>
            <div className="flex flex-wrap gap-1.5">
              {element.isotopes.map((iso) => (
                <span key={iso.mass} className="inline-flex items-center gap-1 rounded-md border bg-background/40 px-1.5 py-0.5 text-xs">
                  <span>
                    <sup>{iso.mass}</sup>
                    {element.symbol}
                  </span>
                  <span className="font-mono text-[10px] text-muted-foreground">{iso.abundance}%</span>
                </span>
              ))}
            </div>
          </div>
        )}

        <Button asChild variant="outline" className="mt-4 w-full">
          <Link to={`/app/element/${element.symbol}`}>
            {t.about} <ArrowRight className="size-4" />
          </Link>
        </Button>
      </div>
    </div>
  );
}
