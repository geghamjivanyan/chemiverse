// Дозаливка ru/hy названий молекул из Wikidata (mol-ru.json / mol-hy.json) в molecules.
// Запуск: node server/scripts/ingest-molecule-names.mjs
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';
import pg from 'pg';

const here = dirname(fileURLToPath(import.meta.url));
const envText = readFileSync(resolve(here, '../../.env'), 'utf8');
const DATABASE_URL = /^DATABASE_URL=(.*)$/m.exec(envText)?.[1]?.trim();

const DIR = '/var/www/chem-data';
const byCid = {}; // cid → { ru, hy }
function load(file, lang) {
  const d = JSON.parse(readFileSync(resolve(DIR, file), 'utf8'));
  for (const r of d.results.bindings) {
    const cid = Number(r.cid.value);
    if (!cid) continue;
    byCid[cid] = byCid[cid] || {};
    // первое название оставляем (Wikidata может вернуть дубли)
    if (!byCid[cid][lang]) byCid[cid][lang] = r.label.value;
  }
}
load('mol-ru.json', 'ru');
load('mol-hy.json', 'hy');
const rows = Object.entries(byCid).map(([cid, n]) => ({ cid: Number(cid), ru: n.ru ?? null, hy: n.hy ?? null }));
console.log(`названий: ${rows.length} молекул`);

const client = new pg.Client({ connectionString: DATABASE_URL });
await client.connect();
await client.query('ALTER TABLE molecules ADD COLUMN IF NOT EXISTS name_ru TEXT, ADD COLUMN IF NOT EXISTS name_hy TEXT');
await client.query('DROP TABLE IF EXISTS mol_names_stage');
await client.query('CREATE TABLE mol_names_stage (cid BIGINT PRIMARY KEY, ru TEXT, hy TEXT)');

let batch = [];
async function flush() {
  if (!batch.length) return;
  const vals = [];
  const ph = batch.map((r, i) => {
    vals.push(r.cid, r.ru, r.hy);
    return `($${i * 3 + 1},$${i * 3 + 2},$${i * 3 + 3})`;
  });
  await client.query(
    `INSERT INTO mol_names_stage (cid,ru,hy) VALUES ${ph.join(',')} ON CONFLICT (cid) DO NOTHING`,
    vals,
  );
  batch = [];
}
for (const r of rows) {
  batch.push(r);
  if (batch.length >= 500) await flush();
}
await flush();

const res = await client.query(
  'UPDATE molecules m SET name_ru = s.ru, name_hy = s.hy FROM mol_names_stage s WHERE m.cid = s.cid',
);
console.log(`обновлено molecules: ${res.rowCount}`);
await client.query('DROP TABLE mol_names_stage');

const { rows: stat } = await client.query(
  'SELECT count(*) FILTER (WHERE name_ru IS NOT NULL)::int ru, count(*) FILTER (WHERE name_hy IS NOT NULL)::int hy FROM molecules',
);
console.log(`с русским: ${stat[0].ru}, с армянским: ${stat[0].hy}`);
await client.end();
