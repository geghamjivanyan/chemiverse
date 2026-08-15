// Скачивает «исторические» (до 2026-03-29, CC BY 4.0) версии PhET-симуляций
// по historical-manifest.json в sims-historical/<name>_<version>_all.html.
// Запуск: node fetch-historical.mjs   (из shared/data/physics/phet/)
import { readFileSync, writeFileSync, mkdirSync, existsSync, statSync } from 'node:fs';

const manifest = JSON.parse(readFileSync('historical-manifest.json', 'utf8'));
mkdirSync('sims-historical', { recursive: true });
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

let ok = 0, skip = 0, none = 0, fail = 0;
for (const [name, m] of Object.entries(manifest)) {
  if (!m.version) { none++; console.log(`${name}: нет до-срезовой версии (${m.note})`); continue; }
  const out = `sims-historical/${name}_${m.version}_all.html`;
  if (existsSync(out) && statSync(out).size > 100000) { skip++; continue; }
  try {
    const res = await fetch(m.url, { signal: AbortSignal.timeout(180000) });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const buf = Buffer.from(await res.arrayBuffer());
    writeFileSync(out, buf);
    ok++;
    console.log(`${name} ${m.version}: ${(buf.length / 1048576).toFixed(1)} MB (${m.lastModified})`);
  } catch (e) {
    fail++;
    console.log(`${name} ${m.version}: FAIL ${e.message}`);
  }
  await sleep(700);
}
console.log(`done: ok=${ok} skip=${skip} none=${none} fail=${fail}`);
