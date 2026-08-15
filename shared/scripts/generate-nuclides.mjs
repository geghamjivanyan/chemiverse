// Генерирует shared/src/physics/nuclides.ts из data/physics/iaea/ground_states.csv
// (IAEA Live Chart of Nuclides, массы AME2020; public domain).
// Запуск: node shared/scripts/generate-nuclides.mjs
import { readFileSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';

const here = dirname(fileURLToPath(import.meta.url));
const raw = readFileSync(resolve(here, '../data/physics/iaea/ground_states.csv'), 'utf8');

// CSV с возможными кавычками (в полях авторов встречаются запятые).
function parseCsvLine(line) {
  const out = [];
  let cur = '', inQ = false;
  for (let i = 0; i < line.length; i++) {
    const ch = line[i];
    if (inQ) {
      if (ch === '"' && line[i + 1] === '"') { cur += '"'; i++; }
      else if (ch === '"') inQ = false;
      else cur += ch;
    } else if (ch === '"') inQ = true;
    else if (ch === ',') { out.push(cur); cur = ''; }
    else cur += ch;
  }
  out.push(cur);
  return out;
}

const lines = raw.trim().split('\n');
const header = parseCsvLine(lines[0]);
const col = Object.fromEntries(header.map((h, i) => [h, i]));
const num = (s) => (s === '' || s === undefined ? undefined : Number(s));

const nuclides = [];
for (const line of lines.slice(1)) {
  const f = parseCsvLine(line);
  const get = (name) => f[col[name]] ?? '';
  const z = Number(get('z'));
  const n = Number(get('n'));
  const symbol = get('symbol');
  if (!symbol) continue;

  const hlRaw = get('half_life');
  const stable = hlRaw === 'STABLE';
  const decays = [];
  for (const i of [1, 2, 3]) {
    const mode = get(`decay_${i}`);
    if (!mode) continue;
    const pct = num(get(`decay_${i}_%`));
    decays.push(pct === undefined ? { mode } : { mode, pct });
  }

  const massMicroU = num(get('atomic_mass'));
  const discovery = get('discovery');
  // поле discovery — год ("1935") либо пусто
  const discoveryYear = /^\d{4}$/.test(discovery) ? Number(discovery) : undefined;

  const rec = {
    z, n, symbol,
    jp: get('jp') || undefined,
    mass: massMicroU !== undefined ? massMicroU / 1e6 : undefined,
    massExcessKeV: num(get('massexcess')),
    bindingKeVPerA: num(get('binding')),
    halfLifeSec: stable ? undefined : num(get('half_life_sec')),
    halfLife: stable || !hlRaw ? undefined : `${hlRaw}${get('unit_hl') ? ' ' + get('unit_hl') : ''}`,
    stable,
    abundance: num(get('abundance')),
    decays,
    discoveryYear,
  };
  // выбрасываем undefined-поля, чтобы файл был компактным
  for (const k of Object.keys(rec)) if (rec[k] === undefined) delete rec[k];
  nuclides.push(rec);
}

nuclides.sort((a, b) => a.z - b.z || a.n - b.n);

const body = nuclides.map((r) => '  ' + JSON.stringify(r)).join(',\n');
const ts = `// AUTO-GENERATED — не редактировать вручную.
// Источник: shared/data/physics/iaea/ground_states.csv
// (IAEA Live Chart of Nuclides + AME2020, public domain; см. shared/data/physics/SOURCES.md).
// Регенерация: node shared/scripts/generate-nuclides.mjs
import type { Nuclide } from './types';

export const nuclides: Nuclide[] = [
${body},
];
`;
writeFileSync(resolve(here, '../src/physics/nuclides.ts'), ts);
const stableCount = nuclides.filter((x) => x.stable).length;
console.log(`nuclides.ts: ${nuclides.length} нуклидов, из них стабильных ${stableCount}`);
