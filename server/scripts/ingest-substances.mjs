// Заливка веществ из Wikidata в таблицу substances.
// Соединения = есть химическая формула P274 + английская статья Wikipedia.
// Тянем имена и описания en/ru/hy + формулу. Перевод недостающих ru/hy — отдельным проходом.
// Запуск: TOTAL=300 node server/scripts/ingest-substances.mjs   (TOTAL=0 → все ~24k)
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';
import pg from 'pg';

const here = dirname(fileURLToPath(import.meta.url));
const envText = readFileSync(resolve(here, '../../.env'), 'utf8');
const DATABASE_URL = /^DATABASE_URL=(.*)$/m.exec(envText)?.[1]?.trim();
const TOTAL = Number(process.env.TOTAL ?? '300'); // 0 = все
const EP = 'https://query.wikidata.org/sparql';
const UA = { 'User-Agent': 'ChemverseEdu/1.0 (https://mendeleev.app; educational)', Accept: 'application/sparql-results+json' };
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function sparql(query, tries = 4) {
  for (let i = 0; i < tries; i++) {
    try {
      const r = await fetch(EP + '?format=json&query=' + encodeURIComponent(query), { headers: UA });
      if (r.ok) return (await r.json()).results.bindings;
      if (r.status === 429 || r.status >= 500) {
        await sleep(2000 * (i + 1));
        continue;
      }
      throw new Error('HTTP ' + r.status);
    } catch (e) {
      if (i === tries - 1) throw e;
      await sleep(2000 * (i + 1));
    }
  }
  return [];
}

async function wbget(ids, tries = 4) {
  const url = `https://www.wikidata.org/w/api.php?action=wbgetentities&ids=${ids.join('|')}&props=labels|descriptions|claims&languages=en|ru|hy&format=json`;
  for (let i = 0; i < tries; i++) {
    try {
      const r = await fetch(url, { headers: { 'User-Agent': UA['User-Agent'] } });
      const txt = await r.text();
      if (!r.ok || txt.startsWith('You are')) {
        await sleep(2000 * (i + 1));
        continue;
      }
      return JSON.parse(txt).entities;
    } catch {
      await sleep(2000 * (i + 1));
    }
  }
  return {};
}

// 1) собираем QID соединений (формула + английская статья), постранично
const qids = [];
const PAGE = TOTAL && TOTAL < 5000 ? TOTAL : 5000;
for (let offset = 0; ; offset += PAGE) {
  const rows = await sparql(
    `SELECT DISTINCT ?i WHERE { ?i wdt:P274 ?f . ?a schema:about ?i ; schema:isPartOf <https://en.wikipedia.org/> . } ORDER BY ?i LIMIT ${PAGE} OFFSET ${offset}`,
  );
  if (!rows.length) break;
  for (const b of rows) qids.push(b.i.value.split('/').pop());
  console.log(`QID собрано: ${qids.length}`);
  if (TOTAL && qids.length >= TOTAL) break;
  await sleep(800);
}
const work = TOTAL ? qids.slice(0, TOTAL) : qids;
console.log(`Всего к заливке: ${work.length}`);

// 2) БД
const client = new pg.Client({ connectionString: DATABASE_URL });
await client.connect();
await client.query(`CREATE TABLE IF NOT EXISTS substances (
  qid TEXT PRIMARY KEY, name_en TEXT, name_ru TEXT, name_hy TEXT,
  desc_en TEXT, desc_ru TEXT, desc_hy TEXT, formula TEXT,
  name_ru_mt BOOLEAN DEFAULT FALSE, name_hy_mt BOOLEAN DEFAULT FALSE,
  desc_ru_mt BOOLEAN DEFAULT FALSE, desc_hy_mt BOOLEAN DEFAULT FALSE
);`);

// 3) wbgetentities пачками по 50 → upsert
let done = 0;
for (let i = 0; i < work.length; i += 50) {
  const batch = work.slice(i, i + 50);
  const ents = await wbget(batch);
  for (const qid of batch) {
    const e = ents[qid];
    if (!e) continue;
    const L = e.labels || {}, D = e.descriptions || {};
    const formula = e.claims?.P274?.[0]?.mainsnak?.datavalue?.value ?? null;
    await client.query(
      `INSERT INTO substances (qid,name_en,name_ru,name_hy,desc_en,desc_ru,desc_hy,formula)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8)
       ON CONFLICT (qid) DO UPDATE SET name_en=EXCLUDED.name_en,name_ru=EXCLUDED.name_ru,name_hy=EXCLUDED.name_hy,
         desc_en=EXCLUDED.desc_en,desc_ru=EXCLUDED.desc_ru,desc_hy=EXCLUDED.desc_hy,formula=EXCLUDED.formula`,
      [qid, L.en?.value ?? null, L.ru?.value ?? null, L.hy?.value ?? null, D.en?.value ?? null, D.ru?.value ?? null, D.hy?.value ?? null, formula],
    );
    done++;
  }
  console.log(`залито: ${done}/${work.length}`);
  await sleep(400);
}

const stat = await client.query(
  `SELECT count(*)::int total, count(name_ru)::int ru, count(name_hy)::int hy, count(desc_en)::int den, count(desc_ru)::int dru FROM substances`,
);
console.log('\nИТОГО в substances:', JSON.stringify(stat.rows[0]));
const sample = await client.query(`SELECT name_en,name_ru,name_hy,formula FROM substances WHERE name_hy IS NOT NULL LIMIT 12`);
console.log('Образец (с армянским):');
for (const r of sample.rows) console.log(`  ${(r.name_hy || '—').padEnd(22)}| ${(r.name_ru || '—').padEnd(20)}| ${(r.name_en || '—').padEnd(22)}| ${r.formula || ''}`);
await client.end();
