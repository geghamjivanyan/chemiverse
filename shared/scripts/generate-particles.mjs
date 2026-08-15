// Генерирует shared/src/physics/particles.ts из data/physics/pdg/pdg-2026.0.sqlite
// (Particle Data Group, Review of Particle Physics 2026; открытые данные LBNL).
// Берём частицы с Monte Carlo ID (реальные состояния, не обзорные записи)
// и сводные значения массы (…M), времени жизни (…T) и ширины (…W).
// Запуск: node shared/scripts/generate-particles.mjs
import { writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';
import { DatabaseSync } from 'node:sqlite';

const here = dirname(fileURLToPath(import.meta.url));
const db = new DatabaseSync(resolve(here, '../data/physics/pdg/pdg-2026.0.sqlite'), { readOnly: true });

const particles = db.prepare(`
  SELECT name, mcid, pdgid, charge,
         quantum_j AS J, quantum_p AS P, quantum_c AS C, quantum_i AS I, quantum_g AS G
  FROM pdgparticle
  WHERE mcid IS NOT NULL
  ORDER BY abs(mcid), mcid < 0
`).all();

// Сводное значение из pdgdata: первое in_summary_table по sort для данного pdgid.
// limit_type: NULL — измерение, 'R' — диапазон (центральное значение осмысленно,
// массы резонансов «1410 to 1470»), 'U'/'L' — верхний/нижний предел (масса фотона,
// нейтрино) — пределы значениями не считаем.
const summary = db.prepare(`
  SELECT value, error_positive, unit_text FROM pdgdata
  WHERE pdgid = ? AND in_summary_table = 1 AND value IS NOT NULL
    AND (limit_type IS NULL OR limit_type = 'R')
  ORDER BY sort LIMIT 1
`);

const toMeV = (v, unit) => {
  if (v == null) return undefined;
  switch ((unit || '').trim()) {
    case 'MeV': return v;
    case 'GeV': return v * 1000;
    case 'keV': return v / 1000;
    case 'eV': return v / 1e6;
    default: return undefined;
  }
};

const out = [];
for (const p of particles) {
  const base = p.pdgid;
  const m = summary.get(`${base}M`);
  const t = summary.get(`${base}T`);
  const w = summary.get(`${base}W`);
  const rec = {
    name: p.name,
    mcid: p.mcid,
    pdgid: base,
    charge: p.charge,
    quantumJ: p.J ?? undefined,
    quantumP: p.P ?? undefined,
    quantumC: p.C ?? undefined,
    quantumI: p.I ?? undefined,
    quantumG: p.G ?? undefined,
    massMeV: m ? toMeV(m.value, m.unit_text) : undefined,
    massErrMeV: m && m.error_positive != null ? toMeV(m.error_positive, m.unit_text) : undefined,
    lifetimeSec: t && /s/.test(t.unit_text || '') ? t.value : undefined,
    widthMeV: w ? toMeV(w.value, w.unit_text) : undefined,
  };
  for (const k of Object.keys(rec)) if (rec[k] === undefined) delete rec[k];
  out.push(rec);
}

const body = out.map((r) => '  ' + JSON.stringify(r)).join(',\n');
const ts = `// AUTO-GENERATED — не редактировать вручную.
// Источник: shared/data/physics/pdg/pdg-2026.0.sqlite (PDG RPP 2026; см. SOURCES.md).
// Регенерация: node shared/scripts/generate-particles.mjs
import type { Particle } from './types';

export const particles: Particle[] = [
${body},
];
`;
writeFileSync(resolve(here, '../src/physics/particles.ts'), ts);
const withMass = out.filter((r) => r.massMeV !== undefined).length;
console.log(`particles.ts: ${out.length} частиц (с массой: ${withMass})`);
