// Заливка неорганических соединений (соли/оксиды/гидроксиды/кислоты) из PubChem 2D в molecules.
// У ионных соединений нет 3D-конформера — берём 2D (z=0), для школьной химии достаточно.
// Запуск: node server/scripts/ingest-salts.mjs
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';
import pg from 'pg';

const here = dirname(fileURLToPath(import.meta.url));
const envText = readFileSync(resolve(here, '../../.env'), 'utf8');
const DATABASE_URL = /^DATABASE_URL=(.*)$/m.exec(envText)?.[1]?.trim();
const periodic = JSON.parse(readFileSync(resolve(here, '../../shared/data/periodic-table-source.json'), 'utf8'));
const Z = {};
for (const e of periodic.elements) Z[e.symbol] = e.number;

const NAMES = [
  // галогениды
  'sodium chloride', 'potassium chloride', 'lithium chloride', 'calcium chloride', 'magnesium chloride',
  'aluminium chloride', 'iron(II) chloride', 'iron(III) chloride', 'copper(II) chloride', 'zinc chloride',
  'ammonium chloride', 'silver chloride', 'barium chloride', 'potassium bromide', 'sodium bromide',
  'potassium iodide', 'sodium iodide', 'sodium fluoride', 'potassium fluoride', 'calcium fluoride', 'tin(II) chloride',
  // оксиды
  'sodium oxide', 'potassium oxide', 'calcium oxide', 'magnesium oxide', 'aluminium oxide', 'iron(III) oxide',
  'iron(II) oxide', 'copper(II) oxide', 'copper(I) oxide', 'zinc oxide', 'silicon dioxide', 'carbon dioxide',
  'carbon monoxide', 'sulfur dioxide', 'sulfur trioxide', 'nitric oxide', 'nitrogen dioxide', 'dinitrogen monoxide',
  'dinitrogen pentoxide', 'phosphorus pentoxide', 'manganese dioxide', 'titanium dioxide', 'chromium trioxide',
  'lead(II) oxide', 'tin(IV) oxide',
  // гидроксиды
  'sodium hydroxide', 'potassium hydroxide', 'lithium hydroxide', 'calcium hydroxide', 'magnesium hydroxide',
  'aluminium hydroxide', 'iron(II) hydroxide', 'iron(III) hydroxide', 'copper(II) hydroxide', 'zinc hydroxide',
  'barium hydroxide', 'ammonium hydroxide',
  // кислоты
  'hydrochloric acid', 'hydrobromic acid', 'hydroiodic acid', 'hydrofluoric acid', 'sulfuric acid', 'nitric acid',
  'phosphoric acid', 'carbonic acid', 'sulfurous acid', 'nitrous acid', 'acetic acid', 'hydrogen sulfide',
  'perchloric acid', 'boric acid', 'hydrogen cyanide', 'silicic acid', 'chromic acid', 'oxalic acid',
  // карбонаты
  'sodium carbonate', 'sodium bicarbonate', 'potassium carbonate', 'calcium carbonate', 'magnesium carbonate',
  'barium carbonate', 'ammonium carbonate', 'lithium carbonate',
  // сульфаты
  'sodium sulfate', 'potassium sulfate', 'calcium sulfate', 'magnesium sulfate', 'copper(II) sulfate',
  'iron(II) sulfate', 'zinc sulfate', 'aluminium sulfate', 'barium sulfate', 'ammonium sulfate', 'sodium thiosulfate',
  // нитраты
  'sodium nitrate', 'potassium nitrate', 'calcium nitrate', 'silver nitrate', 'ammonium nitrate',
  'copper(II) nitrate', 'lead(II) nitrate',
  // фосфаты
  'sodium phosphate', 'calcium phosphate', 'sodium dihydrogen phosphate',
  // перманганаты/хроматы
  'potassium permanganate', 'potassium dichromate', 'potassium chromate', 'sodium chromate',
  // сульфиды
  'sodium sulfide', 'iron(II) sulfide', 'zinc sulfide', 'copper(II) sulfide', 'lead(II) sulfide', 'calcium sulfide',
  // прочее
  'sodium hypochlorite', 'calcium carbide', 'ammonia', 'hydrogen peroxide', 'water', 'methane', 'ethanol',
  'glucose', 'sucrose', 'potassium hydrogen carbonate', 'sodium nitrite', 'potassium nitrite', 'phosphine',
];

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

function hill(counts) {
  const k = Object.keys(counts);
  const ord = [];
  if (counts.C) { ord.push('C'); if (counts.H) ord.push('H'); ord.push(...k.filter((x) => x !== 'C' && x !== 'H').sort()); }
  else ord.push(...k.sort());
  return ord.map((x) => (counts[x] > 1 ? `${x}${counts[x]}` : x)).join('');
}

function parseSDF(sdf) {
  const lines = sdf.split('\n');
  const cid = Number(lines[0]?.trim());
  if (!cid || !lines[3]) return null;
  const nA = parseInt(lines[3].slice(0, 3), 10);
  const nB = parseInt(lines[3].slice(3, 6), 10);
  if (!nA) return null;
  const atoms = [];
  const counts = {};
  for (let i = 0; i < nA; i++) {
    const p = lines[4 + i].trim().split(/\s+/);
    const z = Z[p[3]];
    if (!z) return null;
    counts[p[3]] = (counts[p[3]] ?? 0) + 1;
    atoms.push({ z, pos: [+(+p[0]).toFixed(3), +(+p[1]).toFixed(3), +(+p[2]).toFixed(3)] });
  }
  const bonds = [];
  for (let i = 0; i < nB; i++) {
    const l = lines[4 + nA + i];
    bonds.push({ a: parseInt(l.slice(0, 3), 10) - 1, b: parseInt(l.slice(3, 6), 10) - 1, order: parseInt(l.slice(6, 9), 10) || 1 });
  }
  return { cid, formula: hill(counts), atomCount: atoms.length, heavyCount: atoms.filter((a) => a.z !== 1).length, geometry: { atoms, bonds } };
}

const client = new pg.Client({ connectionString: DATABASE_URL });
await client.connect();
let ok = 0, fail = 0, skip = 0;
for (const name of NAMES) {
  try {
    const r = await fetch(`https://pubchem.ncbi.nlm.nih.gov/rest/pug/compound/name/${encodeURIComponent(name)}/SDF?record_type=2d`, {
      headers: { 'User-Agent': 'ChemverseEdu/1.0' },
    });
    if (!r.ok) { fail++; console.log(`✗ ${name}: ${r.status}`); await sleep(350); continue; }
    const m = parseSDF(await r.text());
    if (!m) { fail++; console.log(`✗ ${name}: parse`); await sleep(350); continue; }
    const disp = name.charAt(0).toUpperCase() + name.slice(1);
    // имя ставим из запроса; геометрию настоящих молекул (water и т.п.) НЕ перезатираем
    await client.query(
      `INSERT INTO molecules (cid,formula,atom_count,heavy_atom_count,geometry,name) VALUES ($1,$2,$3,$4,$5,$6)
       ON CONFLICT (cid) DO UPDATE SET name = COALESCE(molecules.name, EXCLUDED.name)`,
      [m.cid, m.formula, m.atomCount, m.heavyCount, JSON.stringify(m.geometry), disp],
    );
    ok++;
    console.log(`✓ ${name} → ${m.formula} (cid ${m.cid})`);
    await sleep(350);
  } catch (e) {
    fail++; console.log(`✗ ${name}: ${e.message}`); await sleep(350);
  }
}
console.log(`\nГОТОВО: добавлено ${ok}, уже было ${skip}, ошибок ${fail}`);
await client.end();
