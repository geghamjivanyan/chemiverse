// Бытовые материалы/смеси по ПРОВЕРЕННЫМ Wikidata QID (без поиска по имени → без омонимов).
// Запуск: node server/scripts/ingest-materials.mjs
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';
import pg from 'pg';

const here = dirname(fileURLToPath(import.meta.url));
const envText = readFileSync(resolve(here, '../../.env'), 'utf8');
const DATABASE_URL = /^DATABASE_URL=(.*)$/m.exec(envText)?.[1]?.trim();
const UA = { 'User-Agent': 'ChemverseEdu/1.0 (https://mendeleev.app; educational)' };
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

// [QID, ожидаемое англ.имя для контроля]
const ITEMS = [
  ['Q283', 'water'], ['Q39558', 'gasoline'], ['Q24489', 'coal'], ['Q11469', 'glass'], ['Q28472', 'hair'],
  ['Q11427', 'steel'], ['Q287', 'wood'], ['Q34396', 'soap'], ['Q45190', 'cement'], ['Q22656', 'petroleum'],
  ['Q11254', 'salt'], ['Q11002', 'sugar'], ['Q11474', 'plastic'], ['Q7873', 'blood'], ['Q7391292', 'air'],
  ['Q8495', 'milk'], ['Q11472', 'paper'], ['Q80228', 'rubber'], ['Q23392', 'ice'], ['Q42292', 'gunpowder'],
  ['Q39908', 'leather'], ['Q1247336', 'charcoal'], ['Q40861', 'marble'], ['Q45621', 'ceramic'], ['Q34095', 'bronze'],
  ['Q204087', 'vinegar'], ['Q40858', 'natural gas'], ['Q179310', 'kerosene'], ['Q5283', 'diamond'], ['Q43482', 'honey'],
  ['Q42329', 'wool'], ['Q11457', 'cotton'], ['Q37681', 'silk'], ['Q22657', 'concrete'], ['Q34679', 'sand'],
  ['Q42302', 'clay'], ['Q184197', 'rust'], ['Q183440', 'chalk'], ['Q40861', 'marble'], ['Q124441', 'wax'],
  ['Q40089', 'brick'], ['Q7561', 'snow'], ['Q132580', 'milk?'], ['Q167510', 'asphalt'], ['Q42213', 'soda'],
];

async function entity(id) {
  const r = await fetch(`https://www.wikidata.org/w/api.php?action=wbgetentities&ids=${id}&props=labels|descriptions|claims&languages=en|ru|hy&format=json`, { headers: UA });
  const t = await r.text();
  if (t.startsWith('You are')) return null;
  return JSON.parse(t).entities[id];
}

const client = new pg.Client({ connectionString: DATABASE_URL });
await client.connect();
let ok = 0;
const seen = new Set();
for (const [qid, expect] of ITEMS) {
  if (seen.has(qid)) continue;
  seen.add(qid);
  try {
    const e = await entity(qid);
    await sleep(350);
    if (!e || e.missing !== undefined) { console.log(`✗ ${qid} (${expect}): нет`); continue; }
    const L = e.labels || {}, D = e.descriptions || {};
    const en = L.en?.value ?? '';
    const formula = e.claims?.P274?.[0]?.mainsnak?.datavalue?.value ?? null;
    await client.query(
      `INSERT INTO substances (qid,name_en,name_ru,name_hy,desc_en,desc_ru,desc_hy,formula)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8)
       ON CONFLICT (qid) DO UPDATE SET name_en=EXCLUDED.name_en,name_ru=EXCLUDED.name_ru,name_hy=EXCLUDED.name_hy,
         desc_en=EXCLUDED.desc_en,desc_ru=EXCLUDED.desc_ru,desc_hy=EXCLUDED.desc_hy`,
      [qid, en || null, L.ru?.value ?? null, L.hy?.value ?? null, D.en?.value ?? null, D.ru?.value ?? null, D.hy?.value ?? null, formula],
    );
    ok++;
    const mark = en.toLowerCase().includes(expect.replace('?', '').toLowerCase()) || expect.includes('?') ? '✓' : '⚠ПРОВЕРЬ';
    console.log(`${mark} ${qid} ожид:${expect.padEnd(12)} → en:${en.padEnd(16)} ru:${L.ru?.value || '—'} hy:${L.hy?.value || '—'}`);
  } catch (err) {
    console.log(`✗ ${qid}: ${err.message}`);
    await sleep(600);
  }
}
console.log(`\nГОТОВО: ${ok}`);
await client.end();
