// Заливка молекул из PubChem 3D SDF (/var/www/chem-data/sdf/*.sdf.gz) в Postgres.
// Запуск: node server/scripts/ingest-molecules.mjs
import { createReadStream, readFileSync, readdirSync } from 'node:fs';
import { createGunzip } from 'node:zlib';
import { createInterface } from 'node:readline';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';
import pg from 'pg';

const here = dirname(fileURLToPath(import.meta.url));
const SDF_DIR = '/var/www/chem-data/sdf';

// DATABASE_URL из корневого .env
const envText = readFileSync(resolve(here, '../../.env'), 'utf8');
const DATABASE_URL = /^DATABASE_URL=(.*)$/m.exec(envText)?.[1]?.trim();
if (!DATABASE_URL) throw new Error('DATABASE_URL не найден в .env');

// symbol → z и z → symbol из нашего датасета
const periodic = JSON.parse(readFileSync(resolve(here, '../../shared/data/periodic-table-source.json'), 'utf8'));
const symToZ = {};
const zToSym = {};
for (const e of periodic.elements) {
  symToZ[e.symbol] = e.number;
  zToSym[e.number] = e.symbol;
}

/** Формула по Хиллу из счётчика символов. */
function hillFormula(counts) {
  const keys = Object.keys(counts);
  const ordered = [];
  if (counts.C) {
    ordered.push('C');
    if (counts.H) ordered.push('H');
    ordered.push(...keys.filter((k) => k !== 'C' && k !== 'H').sort());
  } else {
    ordered.push(...keys.sort());
  }
  return ordered.map((k) => (counts[k] > 1 ? `${k}${counts[k]}` : k)).join('');
}

function parseRecord(lines) {
  const cid = Number(lines[0]?.trim());
  if (!cid || !lines[3]) return null;
  const nAtoms = parseInt(lines[3].slice(0, 3), 10);
  const nBonds = parseInt(lines[3].slice(3, 6), 10);
  if (!nAtoms) return null;
  const atoms = [];
  const counts = {};
  for (let i = 0; i < nAtoms; i++) {
    const p = lines[4 + i].trim().split(/\s+/);
    const sym = p[3];
    const z = symToZ[sym];
    if (!z) return null;
    counts[sym] = (counts[sym] ?? 0) + 1;
    atoms.push({ z, pos: [+(+p[0]).toFixed(3), +(+p[1]).toFixed(3), +(+p[2]).toFixed(3)] });
  }
  const bonds = [];
  for (let i = 0; i < nBonds; i++) {
    const l = lines[4 + nAtoms + i];
    bonds.push({ a: parseInt(l.slice(0, 3), 10) - 1, b: parseInt(l.slice(3, 6), 10) - 1, order: parseInt(l.slice(6, 9), 10) || 1 });
  }
  const heavy = atoms.filter((a) => a.z !== 1).length;
  return { cid, formula: hillFormula(counts), atomCount: atoms.length, heavyCount: heavy, geometry: { atoms, bonds } };
}

const client = new pg.Client({ connectionString: DATABASE_URL });
await client.connect();
await client.query(`
  CREATE TABLE IF NOT EXISTS molecules (
    cid BIGINT PRIMARY KEY,
    formula TEXT NOT NULL,
    atom_count INT NOT NULL,
    heavy_atom_count INT NOT NULL,
    geometry JSONB NOT NULL
  );
  CREATE INDEX IF NOT EXISTS idx_molecules_formula ON molecules(formula);
`);

let batch = [];
let total = 0;
async function flush() {
  if (!batch.length) return;
  const vals = [];
  const ph = batch.map((m, i) => {
    const o = i * 5;
    vals.push(m.cid, m.formula, m.atomCount, m.heavyCount, JSON.stringify(m.geometry));
    return `($${o + 1},$${o + 2},$${o + 3},$${o + 4},$${o + 5})`;
  });
  await client.query(
    `INSERT INTO molecules (cid,formula,atom_count,heavy_atom_count,geometry) VALUES ${ph.join(',')} ON CONFLICT (cid) DO NOTHING`,
    vals,
  );
  total += batch.length;
  batch = [];
}

const files = readdirSync(SDF_DIR).filter((f) => f.endsWith('.sdf.gz')).sort();
console.log(`файлов: ${files.length}`);
for (const file of files) {
  const rl = createInterface({ input: createReadStream(resolve(SDF_DIR, file)).pipe(createGunzip()), crlfDelay: Infinity });
  let rec = [];
  let inFile = 0;
  for await (const line of rl) {
    if (line === '$$$$') {
      const m = parseRecord(rec);
      if (m) {
        batch.push(m);
        inFile++;
        if (batch.length >= 500) await flush();
      }
      rec = [];
    } else {
      rec.push(line);
    }
  }
  await flush();
  console.log(`✓ ${file}: +${inFile} (всего ${total})`);
}

const { rows } = await client.query('SELECT count(*)::int n, count(DISTINCT formula)::int f FROM molecules');
console.log(`\nГОТОВО: ${rows[0].n} молекул, уникальных формул: ${rows[0].f}`);
await client.end();
