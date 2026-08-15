import { chromium } from 'playwright';

const url = process.argv[2] ?? 'http://localhost:5173';
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
await page.goto(url, { waitUntil: 'networkidle' });
await page.waitForSelector('.tile', { timeout: 10000 });
await page.waitForTimeout(600);
await page.screenshot({ path: '/tmp/chemverse-phase1.png', fullPage: false });

// навести на железо (Z=26), снять состояние детальной панели
await page.locator('.tile[data-z="26"]').hover();
await page.waitForTimeout(400);
await page.screenshot({ path: '/tmp/chemverse-phase1-hover.png', fullPage: false });

// поиск
await page.fill('.search', 'газ');
await page.waitForTimeout(400);
await page.screenshot({ path: '/tmp/chemverse-phase1-search.png', fullPage: false });

const tileCount = await page.locator('.tile').count();
console.log('tiles rendered:', tileCount);
await browser.close();
