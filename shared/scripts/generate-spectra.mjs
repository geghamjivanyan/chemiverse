// Генерирует shared/src/physics/spectra.ts из data/physics/nist-asd/lines/<Sym>-I.tsv
// (NIST Atomic Spectra Database, SRD 78, public domain).
// Для каждого элемента: топ видимых линий по интенсивности + суммарный цвет свечения.
// Запуск: node shared/scripts/generate-spectra.mjs
import { readFileSync, writeFileSync, readdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';

const here = dirname(fileURLToPath(import.meta.url));
const linesDir = resolve(here, '../data/physics/nist-asd/lines');
const elements = JSON.parse(readFileSync(resolve(here, '../data/elements-db.json'), 'utf8'));
const zBySymbol = Object.fromEntries(elements.map((e) => [e.symbol, e.z]));

// Приближённое преобразование длины волны (нм, видимый диапазон) в linear-RGB.
function wavelengthToRgb(nm) {
  let r = 0, g = 0, b = 0;
  if (nm >= 380 && nm < 440) { r = (440 - nm) / 60; b = 1; }
  else if (nm < 490) { g = (nm - 440) / 50; b = 1; }
  else if (nm < 510) { g = 1; b = (510 - nm) / 20; }
  else if (nm < 580) { r = (nm - 510) / 70; g = 1; }
  else if (nm < 645) { r = 1; g = (645 - nm) / 65; }
  else if (nm <= 780) { r = 1; }
  // затухание чувствительности на краях
  let f = 1;
  if (nm < 420) f = 0.3 + 0.7 * (nm - 380) / 40;
  else if (nm > 700) f = 0.3 + 0.7 * (780 - nm) / 80;
  return [r * f, g * f, b * f];
}

const strip = (s) => s.replace(/^"|"$/g, '').trim();

const spectra = [];
for (const file of readdirSync(linesDir).sort()) {
  const m = file.match(/^(\w+)-I\.tsv$/);
  if (!m) continue;
  const symbol = m[1];
  const z = zBySymbol[symbol];
  if (!z) continue;

  const rows = readFileSync(resolve(linesDir, file), 'utf8').trim().split('\n');
  const header = rows[0].split('\t').map((h) => h.trim());
  const iObs = header.indexOf('obs_wl_air(nm)');
  const iRitz = header.indexOf('ritz_wl_air(nm)');
  const iInt = header.indexOf('intens');
  const iAki = header.indexOf('Aki(s^-1)');

  // Две шкалы веса, несравнимые между собой: наблюдённая интенсивность (intens)
  // и вероятность перехода Aki. Внутри элемента используем одну: intens, если
  // она вообще есть; Aki — только как фолбэк для элементов без intens (Fr).
  const byIntens = [];
  const byAki = [];
  for (const row of rows.slice(1)) {
    const f = row.split('\t');
    const wl = Number(strip(f[iObs] ?? '')) || Number(strip(f[iRitz] ?? '').replace(/[[\]]/g, ''));
    if (!wl || wl < 380 || wl > 780) continue;
    const nm = Math.round(wl * 100) / 100;
    // интенсивность бывает с качественными пометками ("500c", "*", "blend") — берём число
    const intMatch = strip(f[iInt] ?? '').match(/^\(?(\d+(?:\.\d+)?)/);
    if (intMatch) byIntens.push({ nm, intensity: Number(intMatch[1]) });
    const aki = Number(strip(f[iAki] ?? ''));
    if (aki > 0) byAki.push({ nm, intensity: aki });
  }
  const lines = byIntens.length ? byIntens : byAki;
  if (!lines.length) continue;

  // Дедуп близких линий (одна и та же линия наблюдённая/расчётная), сортировка по силе.
  lines.sort((a, b) => b.intensity - a.intensity);
  const top = [];
  for (const l of lines) {
    if (top.some((t) => Math.abs(t.nm - l.nm) < 0.5)) continue;
    top.push(l);
    if (top.length >= 12) break;
  }

  // Цвет свечения: линии, взвешенные корнем интенсивности (сжимает динамический диапазон).
  let r = 0, g = 0, b = 0;
  for (const l of top) {
    const w = Math.sqrt(l.intensity);
    const [lr, lg, lb] = wavelengthToRgb(l.nm);
    r += lr * w; g += lg * w; b += lb * w;
  }
  const max = Math.max(r, g, b) || 1;
  const hex = (x) => Math.round(255 * Math.pow(Math.min(x / max, 1), 1 / 2.2)).toString(16).padStart(2, '0');
  spectra.push({ z, symbol, color: `#${hex(r)}${hex(g)}${hex(b)}`, lines: top });
}

spectra.sort((a, b) => a.z - b.z);

const body = spectra.map((r) => '  ' + JSON.stringify(r)).join(',\n');
const ts = `// AUTO-GENERATED — не редактировать вручную.
// Источник: shared/data/physics/nist-asd/lines/*.tsv (NIST ASD SRD 78, public domain).
// Видимые (380–780 нм) эмиссионные линии нейтральных атомов; цвет — взвешенная сумма линий.
// Регенерация: node shared/scripts/generate-spectra.mjs
import type { ElementSpectrum } from './types';

export const spectra: ElementSpectrum[] = [
${body},
];

const bySymbol = new Map(spectra.map((s) => [s.symbol, s]));
export function spectrumOf(symbol: string): ElementSpectrum | undefined {
  return bySymbol.get(symbol);
}
`;
writeFileSync(resolve(here, '../src/physics/spectra.ts'), ts);
console.log(`spectra.ts: ${spectra.length} элементов со спектрами`);
