// Скачивает видимые (380–780 нм) эмиссионные линии нейтральных атомов (X I)
// всех 118 элементов из NIST Atomic Spectra Database в TSV.
// Источник: https://physics.nist.gov/PhysRefData/ASD/lines_form.html (public domain, NIST SRD 78)
// Запуск: node fetch-lines.mjs   (из shared/data/physics/nist-asd/)
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';

const els = JSON.parse(readFileSync('/var/www/chemistry/shared/data/elements-db.json', 'utf8'));
mkdirSync('lines', { recursive: true });
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

const base = 'https://physics.nist.gov/cgi-bin/ASD/lines1.pl';
const params = (sym) =>
  `spectra=${encodeURIComponent(sym + ' I')}&low_w=380&upp_w=780&unit=1&submit=Retrieve+Data&de=0` +
  `&format=3&line_out=0&en_unit=0&output=0&bibrefs=1&page_size=15&show_obs_wl=1&show_calc_wl=1` +
  `&order_out=0&max_low_enrg=&show_av=2&max_upp_enrg=&tsb_value=0&min_str=&A_out=0&intens_out=on` +
  `&max_str=&allowed_out=1&forbid_out=1&min_accur=&min_intens=&conf_out=on&term_out=on&enrg_out=on&J_out=on`;

let ok = 0, empty = 0, fail = 0;
for (const el of els) {
  const sym = el.symbol;
  try {
    const res = await fetch(`${base}?${params(sym)}`, { signal: AbortSignal.timeout(45000) });
    const text = await res.text();
    if (text.startsWith('obs_wl') && text.trim().split('\n').length > 1) {
      writeFileSync(`lines/${sym}-I.tsv`, text);
      ok++;
      console.log(`${sym}: ${text.trim().split('\n').length - 1} lines`);
    } else {
      empty++;
      console.log(`${sym}: no data`);
    }
  } catch (e) {
    fail++;
    console.log(`${sym}: FAIL ${e.message}`);
  }
  await sleep(1500);
}
console.log(`done: ok=${ok} empty=${empty} fail=${fail}`);
