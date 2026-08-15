// Строит манифест «исторических» версий PhET-симуляций (опубликованных до 2026-03-29,
// т.е. под CC BY 4.0 по Historical Software Agreement, а не под новой BY-NC).
// У phetsims нет тегов версий — есть релизные ветки major.minor; patch-версии
// перебираем прямо на CDN, дату публикации даёт Last-Modified.
// Запуск: node build-historical-manifest.mjs → historical-manifest.json
import { readFileSync, writeFileSync } from 'node:fs';
import { execSync } from 'node:child_process';

const CUTOFF = Date.parse('2026-03-29T00:00:00Z');
const meta = JSON.parse(readFileSync('metadata-en.json', 'utf8'));
const sims = meta.projects.flatMap((p) => p.simulations.map((s) => s.name)).sort();

async function headInfo(url) {
  try {
    const res = await fetch(url, { method: 'HEAD', signal: AbortSignal.timeout(20000) });
    if (!res.ok) return null;
    const lm = res.headers.get('last-modified');
    return { lastModified: lm, ts: lm ? Date.parse(lm) : null };
  } catch { return null; }
}

const manifest = {};
let done = 0;
for (const name of sims) {
  done++;
  let branches = [];
  try {
    const out = execSync(`git ls-remote --heads https://github.com/phetsims/${name}.git 2>/dev/null`, {
      encoding: 'utf8', timeout: 30000,
    });
    branches = out.split('\n')
      .map((l) => (l.match(/refs\/heads\/(\d+\.\d+)$/) || [])[1])
      .filter(Boolean)
      .sort((a, b) => {
        const [a1, a2] = a.split('.').map(Number), [b1, b2] = b.split('.').map(Number);
        return b1 - a1 || b2 - a2;
      });
  } catch { }

  let picked = null;
  outer:
  for (const br of branches) {
    // ищем самый высокий patch этой ветки, опубликованный до среза
    let best = null;
    let misses = 0;
    for (let patch = 0; patch <= 20 && misses < 3; patch++) {
      const v = `${br}.${patch}`;
      const url = `https://phet.colorado.edu/sims/html/${name}/${v}/${name}_all.html`;
      const info = await headInfo(url);
      if (!info) { misses++; continue; }
      misses = 0;
      if (info.ts && info.ts < CUTOFF) best = { version: v, ...info, url };
    }
    if (best) { picked = best; break outer; }
  }
  manifest[name] = picked || { version: null, note: branches.length ? `branches ${branches.join(',')} have no pre-cutoff files` : 'no release branches' };
  console.log(`${done}/${sims.length} ${name}: ${picked ? picked.version + ' (' + picked.lastModified + ')' : 'NONE'}`);
}

writeFileSync('historical-manifest.json', JSON.stringify(manifest, null, 2));
const okCount = Object.values(manifest).filter((m) => m.version).length;
console.log(`manifest done: ${okCount}/${sims.length} sims have pre-cutoff (CC BY) versions`);
