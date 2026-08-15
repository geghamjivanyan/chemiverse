import { useEffect, useState } from 'react';
import type { CSSProperties, ReactNode } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { byZ, elements } from '@chemverse/shared';
import type { ElementFull } from '@chemverse/shared';
import { ChevronLeft, ChevronRight, LayoutGrid, ArrowUpRight, ArrowLeft, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { cn } from '@/lib/utils';
import { CATEGORY_COLORS } from '../periodic/colors';
import { AtomCanvas } from '../scene/AtomCanvas';
import type { AtomMode } from '../scene/Atom';
import { useI18n } from '../i18n';
import { LanguageSwitcher } from '../i18n/LanguageSwitcher';
import { FUN_FACTS } from './funFacts';

// суперлативы (считаем один раз по бандлу)
const maxBy = (key: (e: (typeof elements)[number]) => number | null) =>
  elements.reduce((a, b) => ((key(b) ?? -Infinity) > (key(a) ?? -Infinity) ? b : a)).z;
const SUP_EN = maxBy((e) => e.electronegativity);
const SUP_MELT = maxBy((e) => e.melt);
const SUP_DENSE = maxBy((e) => e.density);
const SUP_LIGHT = elements.reduce((a, b) => (b.mass < a.mass ? b : a)).z;

function prettyConfig(cfg: string): ReactNode[] {
  return cfg.split(/\s+/).map((tok, i) => {
    const m = /^([spdf])(\d+)$/i.exec(tok);
    return (
      <span key={i} className="mr-1">
        {m ? (<>{m[1]}<sup>{m[2]}</sup></>) : tok}
      </span>
    );
  });
}

function Row({ label, value }: { label: string; value: ReactNode }) {
  const empty = value === '—' || value == null;
  return (
    <div className="flex items-baseline justify-between gap-3 border-b border-border/60 py-1.5 text-sm last:border-0">
      <span className="text-muted-foreground">{label}</span>
      <span className={cn('text-right font-mono tabular-nums', empty ? 'text-muted-foreground/50' : 'text-foreground')}>{value}</span>
    </div>
  );
}

export function ElementPage({ embedded = false }: { embedded?: boolean }) {
  const { symbol } = useParams<{ symbol: string }>();
  const { t, locale } = useI18n();
  const navigate = useNavigate();
  const [el, setEl] = useState<ElementFull | null | undefined>(undefined);
  const [mode, setMode] = useState<AtomMode>('bohr');
  const base = embedded ? '/app/element/' : '/element/';
  const homeTo = embedded ? '/app/table' : '/';

  useEffect(() => {
    setEl(undefined);
    fetch(`/api/elements/${symbol}`)
      .then((r) => (r.ok ? r.json() : null))
      .then(setEl)
      .catch(() => setEl(null));
    window.scrollTo(0, 0);
  }, [symbol]);

  if (el === undefined) return <div className="flex h-full items-center justify-center text-muted-foreground">…</div>;
  if (el === null)
    return (
      <div className="flex h-full flex-col items-center justify-center gap-3 text-muted-foreground">
        <p>—</p>
        <Button variant="outline" onClick={() => navigate(-1)}><ArrowLeft className="size-4" /> {t.back}</Button>
      </div>
    );

  const color = CATEGORY_COLORS[el.category];
  const accent = `color-mix(in srgb, ${color} 70%, white)`; // осветлённый акцент — читается на тёмном
  const prev = byZ.get(el.z - 1);
  const next = byZ.get(el.z + 1);
  const desc = el.description[locale] || el.description.en;
  const oxstates = el.oxidationStates.length
    ? el.oxidationStates.slice().sort((a, b) => a - b).map((o) => (o > 0 ? `+${o}` : `${o}`).replace('-', '−')).join(' ')
    : '—';

  const funFacts = FUN_FACTS[el.symbol];

  const supers: string[] = [];
  if (el.z === SUP_EN) supers.push(t.supEN);
  if (el.z === SUP_MELT) supers.push(t.supMelt);
  if (el.z === SUP_DENSE) supers.push(t.supDense);
  if (el.z === SUP_LIGHT) supers.push(t.supLight);

  const facts: string[] = [
    `№${el.z} · ${el.period} · ${t.categories[el.category]}`,
    `${el.z} ${t.protons} · ${el.neutrons} ${t.neutrons} · ${el.z} ${t.electrons}`,
    `${t.state}: ${t.phases[el.phase]}`,
  ];
  if (el.discoveredBy || el.yearDiscovered) facts.push(`${t.discoveredBy}: ${[el.discoveredBy, el.yearDiscovered].filter(Boolean).join(', ')}`);

  return (
    <div className={embedded ? 'bg-background' : 'min-h-screen bg-background'} style={{ '--c': color } as CSSProperties}>
      {embedded ? null : (
        <header className="sticky top-0 z-10 flex items-center justify-between border-b bg-background/80 px-5 py-3 backdrop-blur">
          <div className="flex items-center gap-1">
            <Button variant="ghost" size="sm" onClick={() => navigate(-1)} className="-ml-2"><ArrowLeft className="size-4" /> {t.back}</Button>
            <Link to="/" className="text-lg font-bold tracking-tight">CHEM<span className="text-muted-foreground">VERSE</span></Link>
          </div>
          <LanguageSwitcher />
        </header>
      )}

      <Tabs defaultValue="overview" className="w-full gap-0 px-5 pb-5 pt-2">
        <div className="grid gap-6 lg:grid-cols-[432px_minmax(0,1fr)]">
          {/* ЛЕВАЯ ПОЛОВИНА: имя → табы → анимация → вся инфа */}
          <div className="space-y-4">
            {/* имя / лого */}
            <div className="flex items-center gap-4">
              <div className="flex size-[72px] shrink-0 items-center justify-center rounded-2xl text-3xl font-bold" style={{ color: accent, background: `color-mix(in srgb, ${color} 18%, var(--card))`, border: `1px solid color-mix(in srgb, ${color} 40%, transparent)` }}>
                {el.symbol}
              </div>
              <div className="min-w-0">
                <div className="font-mono text-sm text-muted-foreground">{el.z}</div>
                <h1 className="truncate text-2xl font-semibold leading-tight">{el.names[locale]}</h1>
                {el.names[locale] !== el.names.en && <div className="truncate text-sm text-muted-foreground">{el.names.en}</div>}
                <span className="mt-1 inline-flex w-fit items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs" style={{ borderColor: `color-mix(in srgb, ${color} 35%, transparent)`, color: accent }}>
                  <span className="size-1.5 rounded-full" style={{ background: accent }} />
                  {t.categories[el.category]}
                </span>
              </div>
            </div>

            {/* горизонтальные табы под именем */}
            <TabsList>
              <TabsTrigger value="overview">{t.tabOverview}</TabsTrigger>
              <TabsTrigger value="facts">{t.tabFacts}</TabsTrigger>
              <TabsTrigger value="about">{t.about}</TabsTrigger>
            </TabsList>

            {/* анимация */}
            <div className="relative h-72 overflow-hidden rounded-xl border bg-card">
              <AtomCanvas element={el} mode={mode} />
              <div className="absolute left-2 top-2 flex rounded-md bg-secondary/80 p-0.5 backdrop-blur">
                {(['bohr', 'orbitals'] as const).map((m) => (
                  <button key={m} onClick={() => setMode(m)} className={cn('rounded px-2 py-1 text-xs', mode === m ? 'bg-background text-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground')}>
                    {m === 'bohr' ? t.modeBohr : t.modeOrbitals}
                  </button>
                ))}
              </div>
            </div>

            {/* частицы */}
            <div className="grid grid-cols-3 gap-1.5">
              {[{ n: el.z, l: t.protons, c: '#ff8a8a' }, { n: el.neutrons, l: t.neutrons, c: 'var(--muted-foreground)' }, { n: el.z, l: t.electrons, c: '#6cc6ff' }].map((p, i) => (
                <div key={i} className="rounded-lg border bg-card py-1.5 text-center">
                  <div className="font-mono text-base font-semibold" style={{ color: p.c }}>{p.n}</div>
                  <div className="text-[11px] text-muted-foreground">{p.l}</div>
                </div>
              ))}
            </div>

            {/* вся инфа — как на странице стола */}
            <div className="rounded-xl border bg-card p-4">
              <Row label={t.atomicMass} value={`${el.mass} ${t.amu}`} />
              <Row label={t.periodGroup} value={`${el.period} / ${el.group}`} />
              <Row label={t.block} value={`${el.block}${t.blockSuffix}`} />
              <Row label={t.state} value={t.phases[el.phase]} />
              <Row label={t.configuration} value={<span className="font-mono">{prettyConfig(el.electronConfig)}</span>} />
              <Row label={t.shells} value={<span className="inline-flex flex-wrap justify-end gap-1">{el.shells.map((n, i) => <span key={i} className="rounded bg-secondary px-1.5 text-xs">{n}</span>)}</span>} />
              <Row label={t.electronegativity} value={el.electronegativity ?? '—'} />
              <Row label={t.valences} value={el.valence.length ? el.valence.join(', ') : '—'} />
              <Row label={t.oxidationStates} value={oxstates} />
              <Row label={t.atomicRadius} value={el.atomicRadius != null ? `${el.atomicRadius} pm` : '—'} />
              <Row label={t.ionization} value={el.ionizationEnergies[0] != null ? `${el.ionizationEnergies[0]} kJ/mol` : '—'} />
              <Row label={t.density} value={el.density != null ? `${el.density} g/cm³` : '—'} />
              <Row label={t.melting} value={el.melt != null ? `${el.melt} K` : '—'} />
              <Row label={t.boiling} value={el.boil != null ? `${el.boil} K` : '—'} />
              {el.discoveredBy && <Row label={t.discoveredBy} value={el.discoveredBy} />}
              {el.yearDiscovered && <Row label={t.yearDiscovered} value={el.yearDiscovered} />}
            </div>

            {/* «Назад» — в самом конце секции */}
            <Button variant="ghost" size="sm" onClick={() => navigate(-1)} className="-ml-2 w-fit">
              <ArrowLeft className="size-4" /> {t.back}
            </Button>
          </div>

          {/* ПРАВАЯ ПОЛОВИНА: контент выбранного таба */}
          <div className="lg:border-l lg:pl-6">
            <TabsContent value="overview" className="mt-0">
              {el.isotopes.length > 0 ? (
                <div className="rounded-xl border bg-card p-4">
                  <div className="mb-2 text-xs font-medium uppercase tracking-wide text-muted-foreground">{t.isotopes}</div>
                  <div className="flex flex-wrap gap-1.5">
                    {el.isotopes.map((iso) => (
                      <span key={iso.mass} className="inline-flex items-center gap-1 rounded-md border bg-background/40 px-1.5 py-0.5 text-sm">
                        <span><sup>{iso.mass}</sup>{el.symbol}</span>
                        <span className="font-mono text-[10px] text-muted-foreground">{iso.abundance}%</span>
                      </span>
                    ))}
                  </div>
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">—</p>
              )}
            </TabsContent>

            <TabsContent value="facts" className="mt-0">
              {supers.length > 0 && (
                <div className="mb-3 flex flex-wrap gap-2">
                  {supers.map((s) => (
                    <span key={s} className="inline-flex items-center gap-1.5 rounded-full border border-amber-500/40 bg-amber-500/10 px-3 py-1 text-sm font-medium text-amber-300">
                      <Star className="size-4" /> {s}
                    </span>
                  ))}
                </div>
              )}
              {funFacts ? (
                <ol className="divide-y divide-border">
                  {funFacts.map((f, i) => (
                    <li key={i} className="flex gap-3.5 py-4 first:pt-0">
                      <span
                        className="mt-0.5 flex size-6 shrink-0 items-center justify-center rounded-full text-[11px] font-bold"
                        style={{ color: accent, background: `color-mix(in srgb, ${color} 15%, transparent)` }}
                      >
                        {i + 1}
                      </span>
                      <div className="min-w-0">
                        <h3 className="font-semibold leading-snug text-foreground">{f.title[locale] ?? f.title.ru ?? f.title.en}</h3>
                        <p className="mt-1 text-sm leading-relaxed text-foreground/85">{f.text[locale] ?? f.text.ru ?? f.text.en}</p>
                      </div>
                    </li>
                  ))}
                </ol>
              ) : (
                <div className="grid gap-2">
                  {facts.map((f, i) => (
                    <div key={i} className="rounded-lg border bg-card px-4 py-3 text-sm">{f}</div>
                  ))}
                </div>
              )}
            </TabsContent>

            <TabsContent value="about" className="mt-0">
              {desc ? <p className="text-sm leading-relaxed text-foreground/90">{desc}</p> : <p className="text-sm text-muted-foreground">—</p>}
              {el.source && (
                <a href={el.source} target="_blank" rel="noreferrer" className="mt-3 inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
                  {t.source} <ArrowUpRight className="size-3.5" />
                </a>
              )}
            </TabsContent>
          </div>
        </div>

        {/* навигация */}
        <nav className="mt-6 flex items-center justify-between gap-3">
          {prev ? <Button asChild variant="outline"><Link to={`${base}${prev.symbol}`}><ChevronLeft className="size-4" /> {prev.z} {prev.symbol}</Link></Button> : <span />}
          <Button asChild variant="ghost"><Link to={homeTo}><LayoutGrid className="size-4" /> {t.subtitle}</Link></Button>
          {next ? <Button asChild variant="outline"><Link to={`${base}${next.symbol}`}>{next.symbol} {next.z} <ChevronRight className="size-4" /></Link></Button> : <span />}
        </nav>
      </Tabs>
    </div>
  );
}
