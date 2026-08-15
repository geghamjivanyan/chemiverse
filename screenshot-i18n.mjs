import { chromium } from 'playwright';

const url = process.argv[2] ?? 'https://mendeleev.app';
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
await page.goto(url, { waitUntil: 'networkidle' });
await page.waitForSelector('.tile', { timeout: 10000 });

const langs = [
  { label: 'EN', file: 'en' },
  { label: 'ՀԱՅ', file: 'hy' },
  { label: 'РУ', file: 'ru' },
];

for (const l of langs) {
  await page.getByRole('button', { name: l.label, exact: true }).click();
  await page.locator('.tile[data-z="8"]').hover(); // кислород — покажем панель
  await page.waitForTimeout(400);
  await page.screenshot({ path: `/tmp/chemverse-${l.file}.png` });
  const sample = await page.evaluate(() => ({
    htmlLang: document.documentElement.lang,
    subtitle: document.querySelector('.sub')?.textContent,
    detailName: document.querySelector('.d-name')?.textContent,
    firstCat: document.querySelector('.leg-item')?.textContent,
  }));
  console.log(l.file, JSON.stringify(sample));
}
await browser.close();
