// Тянет краткие описания 118 элементов из Wikipedia на en/ru/hy.
// Батч-запросы action API (по 20 заголовков) — надёжно, без rate-limit.
// Запуск: node shared/scripts/generate-element-descriptions.mjs
import { readFileSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';

const here = dirname(fileURLToPath(import.meta.url));
const wd = JSON.parse(readFileSync(resolve(here, '../data/wikidata-names.json'), 'utf8'));
const cap = (s) => (s ? s.charAt(0).toLocaleUpperCase() + s.slice(1) : s);

const names = {}; // z → { en, ru, hy }
for (const r of wd.results.bindings) {
  const z = Number(r.z.value);
  names[z] = names[z] || {};
  if (r.en) names[z].en = cap(r.en.value);
  if (r.ru) names[z].ru = cap(r.ru.value);
  if (r.hy) names[z].hy = cap(r.hy.value);
}

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

function resolveExtracts(data, inputTitles) {
  const q = data.query || {};
  const norm = {};
  (q.normalized || []).forEach((n) => (norm[n.from] = n.to));
  const redir = {};
  (q.redirects || []).forEach((r) => (redir[r.from] = r.to));
  const byTitle = {};
  Object.values(q.pages || {}).forEach((p) => {
    byTitle[p.title] = (p.extract || '').trim() || null;
  });
  const out = {};
  for (const t of inputTitles) {
    let cur = norm[t] || t;
    cur = redir[cur] || cur;
    out[t] = byTitle[cur] ?? null;
  }
  return out;
}

async function fetchBatch(lang, batch) {
  const url =
    `https://${lang}.wikipedia.org/w/api.php?action=query&format=json&redirects=1` +
    `&prop=extracts&exintro=1&explaintext=1&exlimit=max&titles=${batch.map(encodeURIComponent).join('%7C')}`;
  for (let attempt = 0; attempt < 5; attempt++) {
    try {
      const r = await fetch(url, {
        headers: { 'User-Agent': 'ChemverseEdu/1.0 (educational; mendeleev.app; theurartu@icloud.com)' },
      });
      const txt = await r.text();
      if (r.ok && txt.startsWith('{')) return resolveExtracts(JSON.parse(txt), batch);
      // rate-limit / HTML — ждём дольше и повторяем
      await sleep(3000 * (attempt + 1));
    } catch {
      await sleep(3000 * (attempt + 1));
    }
  }
  console.warn(`${lang}: батч не удался после ретраев`);
  return {};
}

async function fetchLang(lang, titles) {
  const result = {};
  for (let i = 0; i < titles.length; i += 20) {
    Object.assign(result, await fetchBatch(lang, titles.slice(i, i + 20)));
    await sleep(1500);
  }
  return result;
}

const out = {};
for (let z = 1; z <= 118; z++) out[z] = { en: null, ru: null, hy: null };

for (const lang of ['en', 'ru', 'hy']) {
  const titles = [];
  const titleToZ = {};
  for (let z = 1; z <= 118; z++) {
    const t = names[z]?.[lang];
    if (t) {
      titles.push(t);
      titleToZ[t] = z;
    }
  }
  const res = await fetchLang(lang, titles);
  let hits = 0;
  for (const [t, ex] of Object.entries(res)) {
    if (ex) {
      out[titleToZ[t]][lang] = ex;
      hits++;
    }
  }
  console.log(`${lang}: ${hits}/118`);
  await sleep(2500); // пауза между языками
}

writeFileSync(resolve(here, '../data/element-descriptions.json'), JSON.stringify(out), 'utf8');
console.log('готово → shared/data/element-descriptions.json');
