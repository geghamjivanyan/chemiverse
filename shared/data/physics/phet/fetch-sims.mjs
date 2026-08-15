// Скачивает все HTML5-симуляции PhET в варианте _all.html (все локали в одном файле).
// Лицензия симуляций: CC BY 4.0 (https://phet.colorado.edu/en/licensing/html).
// Запуск: node fetch-sims.mjs   (из shared/data/physics/phet/)
import { readFileSync, writeFileSync, mkdirSync, existsSync, statSync } from 'node:fs';

const meta = JSON.parse(readFileSync('metadata-en.json', 'utf8'));
mkdirSync('sims', { recursive: true });
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

let ok = 0, skip = 0, fail = 0;
for (const proj of meta.projects) {
  for (const sim of proj.simulations) {
    const url = `https://phet.colorado.edu${sim.allLocalesSimURL}`;
    const out = `sims/${sim.name}_all.html`;
    if (existsSync(out) && statSync(out).size > 100000) { skip++; continue; }
    try {
      const res = await fetch(url, { signal: AbortSignal.timeout(180000) });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const buf = Buffer.from(await res.arrayBuffer());
      writeFileSync(out, buf);
      ok++;
      console.log(`${sim.name}: ${(buf.length / 1048576).toFixed(1)} MB`);
    } catch (e) {
      fail++;
      console.log(`${sim.name}: FAIL ${e.message}`);
    }
    await sleep(700);
  }
}
console.log(`done: ok=${ok} skip=${skip} fail=${fail}`);
