// Дозаливка англ. названий молекул из PubChem CID-Title (cid-title-1m.tsv) в molecules.name
// Запуск: node server/scripts/ingest-names.mjs
import { createReadStream, readFileSync } from 'node:fs';
import { createInterface } from 'node:readline';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';
import pg from 'pg';

const here = dirname(fileURLToPath(import.meta.url));
const TSV = '/var/www/chem-data/cid-title-1m.tsv';
const envText = readFileSync(resolve(here, '../../.env'), 'utf8');
const DATABASE_URL = /^DATABASE_URL=(.*)$/m.exec(envText)?.[1]?.trim();

const client = new pg.Client({ connectionString: DATABASE_URL });
await client.connect();

await client.query('ALTER TABLE molecules ADD COLUMN IF NOT EXISTS name TEXT');
await client.query('DROP TABLE IF EXISTS cid_title_stage');
await client.query('CREATE TABLE cid_title_stage (cid BIGINT PRIMARY KEY, name TEXT)');

let batch = [];
let total = 0;
async function flush() {
  if (!batch.length) return;
  const vals = [];
  const ph = batch.map((r, i) => {
    vals.push(r.cid, r.name);
    return `($${i * 2 + 1},$${i * 2 + 2})`;
  });
  await client.query(
    `INSERT INTO cid_title_stage (cid,name) VALUES ${ph.join(',')} ON CONFLICT (cid) DO NOTHING`,
    vals,
  );
  total += batch.length;
  batch = [];
}

const rl = createInterface({ input: createReadStream(TSV), crlfDelay: Infinity });
for await (const line of rl) {
  const tab = line.indexOf('\t');
  if (tab < 0) continue;
  const cid = Number(line.slice(0, tab));
  const name = line.slice(tab + 1).trim();
  if (!cid || !name) continue;
  batch.push({ cid, name });
  if (batch.length >= 1000) await flush();
}
await flush();
console.log(`staging залит: ${total} названий`);

const res = await client.query(
  'UPDATE molecules m SET name = s.name FROM cid_title_stage s WHERE m.cid = s.cid',
);
console.log(`обновлено molecules.name: ${res.rowCount}`);
await client.query('DROP TABLE cid_title_stage');

// индекс для поиска по названию (регистронезависимый)
await client.query('CREATE EXTENSION IF NOT EXISTS pg_trgm').catch(() => {});
await client.query('CREATE INDEX IF NOT EXISTS idx_molecules_name_trgm ON molecules USING gin (lower(name) gin_trgm_ops)').catch((e) => console.log('trgm index skip:', e.message));

const { rows } = await client.query("SELECT count(*)::int AS named FROM molecules WHERE name IS NOT NULL");
console.log(`ГОТОВО: с названием — ${rows[0].named}`);
await client.end();
