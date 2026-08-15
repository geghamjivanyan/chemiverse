// Заливка полных данных 118 элементов (shared/data/elements-db.json) в Postgres.
// Запуск: node server/scripts/ingest-elements.mjs
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';
import pg from 'pg';

const here = dirname(fileURLToPath(import.meta.url));
const envText = readFileSync(resolve(here, '../../.env'), 'utf8');
const DATABASE_URL = /^DATABASE_URL=(.*)$/m.exec(envText)?.[1]?.trim();
const elements = JSON.parse(readFileSync(resolve(here, '../../shared/data/elements-db.json'), 'utf8'));

const client = new pg.Client({ connectionString: DATABASE_URL });
await client.connect();
await client.query(`
  CREATE TABLE IF NOT EXISTS elements (
    z INT PRIMARY KEY,
    symbol TEXT UNIQUE NOT NULL,
    data JSONB NOT NULL
  );
`);
for (const e of elements) {
  await client.query(
    `INSERT INTO elements (z, symbol, data) VALUES ($1,$2,$3)
     ON CONFLICT (z) DO UPDATE SET symbol = EXCLUDED.symbol, data = EXCLUDED.data`,
    [e.z, e.symbol, JSON.stringify(e)],
  );
}
const { rows } = await client.query('SELECT count(*)::int n FROM elements');
console.log(`ГОТОВО: ${rows[0].n} элементов в таблице elements`);
await client.end();
