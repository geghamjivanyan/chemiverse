// Собирает web/src/element/facts/<Sym>.json (по одному файлу на элемент)
// в один web/src/element/funFacts.<lang>.json и проверяет полноту/валидность.
// Запуск: node web/scripts/merge-facts.mjs [lang]   (lang по умолчанию en)
import fs from 'fs';
import path from 'path';

const lang = process.argv[2] || 'en';
const DIR = lang === 'en' ? 'web/src/element/facts' : `web/src/element/facts-${lang}`;
const elements = JSON.parse(fs.readFileSync('/tmp/elements.json', 'utf8'));

const out = {};
const problems = [];
for (const el of elements) {
  const f = path.join(DIR, `${el.symbol}.json`);
  if (!fs.existsSync(f)) { problems.push(`MISSING  ${el.symbol}`); continue; }
  let data;
  try { data = JSON.parse(fs.readFileSync(f, 'utf8')); }
  catch (e) { problems.push(`BADJSON  ${el.symbol}: ${e.message}`); continue; }
  const facts = Array.isArray(data) ? data : data.facts;
  if (!Array.isArray(facts)) { problems.push(`NOFACTS  ${el.symbol}`); continue; }
  const clean = facts.filter((x) => x && x.title && x.text).map((x) => ({ title: String(x.title).trim(), text: String(x.text).trim() }));
  if (clean.length !== 10) problems.push(`COUNT    ${el.symbol}: ${clean.length} (need 10)`);
  if (clean.length) out[el.symbol] = clean;
}

const dest = `web/src/element/funFacts.${lang}.json`;
fs.writeFileSync(dest, JSON.stringify(out, null, 1));
console.log(`→ ${dest}`);
console.log(`elements with facts: ${Object.keys(out).length} / ${elements.length}`);
console.log(`total facts: ${Object.values(out).reduce((a, b) => a + b.length, 0)}`);
if (problems.length) { console.log(`\nPROBLEMS (${problems.length}):`); console.log(problems.join('\n')); }
else console.log('\nall good ✓');
