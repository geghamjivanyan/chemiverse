// Генерирует shared/src/physics/constants.ts из data/physics/codata/codata2022-allascii.txt
// (CODATA 2022, NIST — public domain).
// Запуск: node shared/scripts/generate-constants.mjs
import { readFileSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';

const here = dirname(fileURLToPath(import.meta.url));
const raw = readFileSync(resolve(here, '../data/physics/codata/codata2022-allascii.txt'), 'utf8');

const lines = raw.split('\n');
const start = lines.findIndex((l) => /^-{20,}/.test(l)) + 1;

const slug = (s) =>
  s.toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');

const parseNum = (s) => Number(s.replace(/ /g, '').replace(/\.\.\./g, ''));

const constants = [];
for (const line of lines.slice(start)) {
  if (!line.trim()) continue;
  // fixed-width: имя [0..60), значение [60..85), погрешность [85..110), единица [110..)
  const name = line.slice(0, 60).trim();
  const valueStr = line.slice(60, 85).trim();
  const uncStr = line.slice(85, 110).trim();
  const unit = line.slice(110).trim();
  if (!name || !valueStr) continue;
  const exact = uncStr === '(exact)';
  constants.push({
    id: slug(name),
    name,
    value: parseNum(valueStr),
    uncertainty: exact ? 0 : parseNum(uncStr),
    unit,
    exact,
  });
}

// Курированные короткие символы для самых ходовых констант.
const WELL_KNOWN = {
  c: 'speed-of-light-in-vacuum',
  h: 'planck-constant',
  hbar: 'reduced-planck-constant',
  e: 'elementary-charge',
  me: 'electron-mass',
  mp: 'proton-mass',
  mn: 'neutron-mass',
  NA: 'avogadro-constant',
  kB: 'boltzmann-constant',
  G: 'newtonian-constant-of-gravitation',
  alpha: 'fine-structure-constant',
  R: 'molar-gas-constant',
  u: 'atomic-mass-constant',
  eps0: 'vacuum-electric-permittivity',
  mu0: 'vacuum-mag-permeability',
  gn: 'standard-acceleration-of-gravity',
  sigma: 'stefan-boltzmann-constant',
  Ry: 'rydberg-constant',
  F: 'faraday-constant',
  muB: 'bohr-magneton',
  a0: 'bohr-radius',
  eV: 'electron-volt',
};
const byId = new Map(constants.map((k) => [k.id, k]));
const missing = Object.entries(WELL_KNOWN).filter(([, id]) => !byId.has(id));
if (missing.length) throw new Error('WELL_KNOWN не найдены в CODATA: ' + missing.map(([s, id]) => `${s}→${id}`).join(', '));

const body = constants.map((r) => '  ' + JSON.stringify(r)).join(',\n');
const wk = Object.entries(WELL_KNOWN)
  .map(([sym, id]) => `  ${sym}: byId('${id}'),`)
  .join('\n');

const ts = `// AUTO-GENERATED — не редактировать вручную.
// Источник: shared/data/physics/codata/codata2022-allascii.txt (CODATA 2022, NIST, public domain).
// Регенерация: node shared/scripts/generate-constants.mjs
import type { PhysConstant } from './types';

export const physConstants: PhysConstant[] = [
${body},
];

const index = new Map(physConstants.map((k) => [k.id, k]));
function byId(id: string): PhysConstant {
  const k = index.get(id);
  if (!k) throw new Error('unknown constant: ' + id);
  return k;
}

/** Ходовые константы под короткими символами: PHYS.c.value, PHYS.h.value… */
export const PHYS = {
${wk}
} as const;

export function constantById(id: string): PhysConstant | undefined {
  return index.get(id);
}
`;
writeFileSync(resolve(here, '../src/physics/constants.ts'), ts);
console.log(`constants.ts: ${constants.length} констант, ${Object.keys(WELL_KNOWN).length} с короткими символами`);
