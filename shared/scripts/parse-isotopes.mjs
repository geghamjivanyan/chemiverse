// Парсит NIST-изотопы (/var/www/chem-data/nist-isotopes.txt) → shared/data/isotopes.json
// Берём природные изотопы (с ненулевой распространённостью).
// Запуск: node shared/scripts/parse-isotopes.mjs
import { readFileSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';

const here = dirname(fileURLToPath(import.meta.url));
const txt = readFileSync('/var/www/chem-data/nist-isotopes.txt', 'utf8');

const re =
  /Atomic Number = (\d+)\s*\nAtomic Symbol = (\w+)\s*\nMass Number = (\d+)\s*\nRelative Atomic Mass = ([\d.]+)[^\n]*\nIsotopic Composition = ([^\n]*)/g;

const byZ = {};
let m;
while ((m = re.exec(txt))) {
  const z = Number(m[1]);
  const mass = Number(m[3]);
  const comp = m[5].trim();
  if (!comp) continue; // нет природной распространённости — пропускаем
  const abundance = Number(comp.replace(/\(.*\)/, '')) * 100; // доля → %
  if (!(abundance > 0)) continue;
  (byZ[z] = byZ[z] || []).push({ mass, abundance: +abundance.toFixed(4) });
}
// сортируем по убыванию распространённости
for (const z of Object.keys(byZ)) byZ[z].sort((a, b) => b.abundance - a.abundance);

writeFileSync(resolve(here, '../data/isotopes.json'), JSON.stringify(byZ), 'utf8');
const total = Object.values(byZ).reduce((a, v) => a + v.length, 0);
console.log(`природных изотопов: ${total}, элементов с изотопами: ${Object.keys(byZ).length}`);
console.log('кислород:', JSON.stringify(byZ[8]));
console.log('олово (макс изотопов):', JSON.stringify(byZ[50]));
