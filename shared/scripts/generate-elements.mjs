// Генерирует shared/src/elements.ts из data/periodic-table-source.json
// (Bowserinator Periodic-Table-JSON, public domain) + русские названия/валентности
// + армянские названия из data/wikidata-names.json (Wikidata, CC0).
// Запуск: node shared/scripts/generate-elements.mjs
import { readFileSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';

const here = dirname(fileURLToPath(import.meta.url));
const src = JSON.parse(
  readFileSync(resolve(here, '../data/periodic-table-source.json'), 'utf8'),
);

// Армянские (и сверочные en/ru) названия из Wikidata, ключ — атомный номер.
const wd = JSON.parse(readFileSync(resolve(here, '../data/wikidata-names.json'), 'utf8'));
const cap = (s) => (s ? s.charAt(0).toLocaleUpperCase() + s.slice(1) : s);
const HY = {};
for (const r of wd.results.bindings) {
  const z = Number(r.z.value);
  if (r.hy && !HY[z]) HY[z] = cap(r.hy.value);
}

// PubChem сводная таблица: atomicRadius, oxidationStates, yearDiscovered (по символу)
const PUB = {};
try {
  const pt = JSON.parse(readFileSync(resolve(here, '../data/pubchem-ptable.json'), 'utf8'));
  const cols = pt.Table.Columns.Column;
  const ix = (n) => cols.indexOf(n);
  for (const row of pt.Table.Row) {
    const c = row.Cell;
    const sym = c[ix('Symbol')];
    const ox = (c[ix('OxidationStates')] || '')
      .split(',')
      .map((s) => Number(s.trim().replace('−', '-')))
      .filter((n) => !Number.isNaN(n));
    PUB[sym] = {
      atomicRadius: c[ix('AtomicRadius')] ? Number(c[ix('AtomicRadius')]) : null,
      oxidationStates: ox,
      yearDiscovered: c[ix('YearDiscovered')] || null,
    };
  }
} catch {
  console.warn('pubchem-ptable.json нет');
}

// изотопы
let ISO = {};
try {
  ISO = JSON.parse(readFileSync(resolve(here, '../data/isotopes.json'), 'utf8'));
} catch {
  console.warn('isotopes.json нет (запусти parse-isotopes.mjs)');
}

// описания из Wikipedia (en/ru/hy), если уже выкачаны
let DESC = {};
try {
  DESC = JSON.parse(readFileSync(resolve(here, '../data/element-descriptions.json'), 'utf8'));
} catch {
  console.warn('element-descriptions.json нет — описания будут пустыми (запусти generate-element-descriptions.mjs)');
}

// убираем строки-уточнения (хатноты) из начала описания и обрезаем длину
function cleanDesc(text) {
  if (!text) return '';
  const lines = text
    .split('\n')
    .filter((l) => !/(կիրառումների համար տե՛ս|այլ կիրառումներ|для других значений|other uses|disambiguation|см\. также|тե՛ս՝)/i.test(l));
  let s = lines.join(' ').replace(/\s+/g, ' ').trim();
  if (s.length > 600) s = s.slice(0, 600).replace(/\s+\S*$/, '') + '…';
  return s;
}

// Русские названия (Z 1..118)
const RU = {
  1: 'Водород', 2: 'Гелий', 3: 'Литий', 4: 'Бериллий', 5: 'Бор', 6: 'Углерод',
  7: 'Азот', 8: 'Кислород', 9: 'Фтор', 10: 'Неон', 11: 'Натрий', 12: 'Магний',
  13: 'Алюминий', 14: 'Кремний', 15: 'Фосфор', 16: 'Сера', 17: 'Хлор', 18: 'Аргон',
  19: 'Калий', 20: 'Кальций', 21: 'Скандий', 22: 'Титан', 23: 'Ванадий', 24: 'Хром',
  25: 'Марганец', 26: 'Железо', 27: 'Кобальт', 28: 'Никель', 29: 'Медь', 30: 'Цинк',
  31: 'Галлий', 32: 'Германий', 33: 'Мышьяк', 34: 'Селен', 35: 'Бром', 36: 'Криптон',
  37: 'Рубидий', 38: 'Стронций', 39: 'Иттрий', 40: 'Цирконий', 41: 'Ниобий',
  42: 'Молибден', 43: 'Технеций', 44: 'Рутений', 45: 'Родий', 46: 'Палладий',
  47: 'Серебро', 48: 'Кадмий', 49: 'Индий', 50: 'Олово', 51: 'Сурьма', 52: 'Теллур',
  53: 'Иод', 54: 'Ксенон', 55: 'Цезий', 56: 'Барий', 57: 'Лантан', 58: 'Церий',
  59: 'Празеодим', 60: 'Неодим', 61: 'Прометий', 62: 'Самарий', 63: 'Европий',
  64: 'Гадолиний', 65: 'Тербий', 66: 'Диспрозий', 67: 'Гольмий', 68: 'Эрбий',
  69: 'Тулий', 70: 'Иттербий', 71: 'Лютеций', 72: 'Гафний', 73: 'Тантал',
  74: 'Вольфрам', 75: 'Рений', 76: 'Осмий', 77: 'Иридий', 78: 'Платина', 79: 'Золото',
  80: 'Ртуть', 81: 'Таллий', 82: 'Свинец', 83: 'Висмут', 84: 'Полоний', 85: 'Астат',
  86: 'Радон', 87: 'Франций', 88: 'Радий', 89: 'Актиний', 90: 'Торий',
  91: 'Протактиний', 92: 'Уран', 93: 'Нептуний', 94: 'Плутоний', 95: 'Америций',
  96: 'Кюрий', 97: 'Берклий', 98: 'Калифорний', 99: 'Эйнштейний', 100: 'Фермий',
  101: 'Менделевий', 102: 'Нобелий', 103: 'Лоуренсий', 104: 'Резерфордий',
  105: 'Дубний', 106: 'Сиборгий', 107: 'Борий', 108: 'Хассий', 109: 'Мейтнерий',
  110: 'Дармштадтий', 111: 'Рентгений', 112: 'Коперниций', 113: 'Нихоний',
  114: 'Флеровий', 115: 'Московий', 116: 'Ливерморий', 117: 'Теннессин',
  118: 'Оганесон',
};

// Типичные валентности (число образуемых связей / основные степени окисления).
// Для сверхтяжёлых (Z>=104) — пусто (предсказанные, в реакциях не участвуют).
const VAL = {
  1: [1], 2: [0], 3: [1], 4: [2], 5: [3], 6: [4], 7: [3], 8: [2], 9: [1], 10: [0],
  11: [1], 12: [2], 13: [3], 14: [4], 15: [3, 5], 16: [2, 4, 6], 17: [1], 18: [0],
  19: [1], 20: [2], 21: [3], 22: [4], 23: [5], 24: [3, 6], 25: [2, 4, 7], 26: [2, 3],
  27: [2, 3], 28: [2], 29: [1, 2], 30: [2], 31: [3], 32: [4], 33: [3, 5], 34: [2, 4, 6],
  35: [1], 36: [0], 37: [1], 38: [2], 39: [3], 40: [4], 41: [5], 42: [6], 43: [7],
  44: [3, 4], 45: [3], 46: [2, 4], 47: [1], 48: [2], 49: [3], 50: [2, 4], 51: [3, 5],
  52: [2, 4, 6], 53: [1], 54: [0], 55: [1], 56: [2], 57: [3], 58: [3, 4], 59: [3],
  60: [3], 61: [3], 62: [3], 63: [2, 3], 64: [3], 65: [3], 66: [3], 67: [3], 68: [3],
  69: [3], 70: [3], 71: [3], 72: [4], 73: [5], 74: [6], 75: [7], 76: [4], 77: [3, 4],
  78: [2, 4], 79: [1, 3], 80: [1, 2], 81: [1, 3], 82: [2, 4], 83: [3, 5], 84: [2, 4],
  85: [1], 86: [0], 87: [1], 88: [2], 89: [3], 90: [4], 91: [5], 92: [4, 6], 93: [5],
  94: [4], 95: [3], 96: [3], 97: [3], 98: [3], 99: [3], 100: [3], 101: [3], 102: [2, 3],
  103: [3],
};

function mapCategory(raw, group) {
  if (group === 17) return 'halogen';
  if (group === 18 || /noble gas/.test(raw)) return 'noble-gas';
  const c = raw.replace(/^unknown, (probably|predicted to be|but predicted to be an?) /, '');
  if (/alkali metal/.test(c)) return 'alkali-metal';
  if (/alkaline earth metal/.test(c)) return 'alkaline-earth-metal';
  if (/lanthanide/.test(c)) return 'lanthanide';
  if (/actinide/.test(c)) return 'actinide';
  if (/metalloid/.test(c)) return 'metalloid';
  if (/post-transition metal/.test(c)) return 'post-transition-metal';
  if (/transition metal/.test(c)) return 'transition-metal';
  if (/nonmetal/.test(c)) return 'nonmetal';
  return 'unknown';
}

function mapPhase(p) {
  if (!p) return 'unknown';
  const s = String(p).toLowerCase();
  if (s === 'gas' || s === 'solid' || s === 'liquid') return s;
  return 'unknown';
}

const elements = src.elements
  .filter((e) => e.number >= 1 && e.number <= 118)
  .sort((a, b) => a.number - b.number)
  .map((e) => {
    const z = e.number;
    const mass = e.atomic_mass;
    const color = e['cpk-hex'] ? `#${e['cpk-hex']}` : '#cccccc';
    return {
      z,
      symbol: e.symbol,
      names: {
        en: e.name,
        hy: HY[z] ?? e.name,
        ru: RU[z] ?? e.name,
      },
      mass,
      neutrons: Math.max(0, Math.round(mass) - z),
      period: e.period,
      group: e.group,
      block: e.block,
      category: mapCategory(e.category, e.group),
      shells: e.shells,
      electronConfig: e.electron_configuration_semantic,
      valence: VAL[z] ?? [],
      electronegativity: e.electronegativity_pauling ?? null,
      phase: mapPhase(e.phase),
      color,
      xpos: e.xpos,
      ypos: e.ypos,
      density: e.density ?? null,
      melt: e.melt ?? null,
      boil: e.boil ?? null,
      molarHeat: e.molar_heat ?? null,
      electronAffinity: e.electron_affinity ?? null,
      ionizationEnergies: e.ionization_energies ?? [],
      discoveredBy: e.discovered_by ?? null,
      namedBy: e.named_by ?? null,
      appearance: e.appearance ?? null,
      source: e.source ?? '',
      description: {
        en: cleanDesc(DESC[z]?.en),
        hy: cleanDesc(DESC[z]?.hy),
        ru: cleanDesc(DESC[z]?.ru),
      },
      atomicRadius: PUB[e.symbol]?.atomicRadius ?? null,
      oxidationStates: PUB[e.symbol]?.oxidationStates ?? [],
      yearDiscovered: PUB[e.symbol]?.yearDiscovered ?? null,
      isotopes: ISO[z] ?? [],
    };
  });

const header = `// AUTO-GENERATED — не редактировать вручную.
// Источники: shared/data/periodic-table-source.json (Bowserinator, public domain),
// shared/data/wikidata-names.json (Wikidata, CC0) — армянские названия,
// + русские названия и валентности из shared/scripts/generate-elements.mjs.
// Регенерация: node shared/scripts/generate-elements.mjs
import type { Element } from './types';

export const elements: Element[] = `;

// полные данные (с описанием) — для заливки в Postgres
writeFileSync(resolve(here, '../data/elements-db.json'), JSON.stringify(elements), 'utf8');

// лёгкий бандл: без тяжёлого description (оно берётся по API на странице элемента)
const light = elements.map((e) => {
  const o = { ...e };
  delete o.description;
  return o;
});
const body = JSON.stringify(light, null, 2);
const out = `${header}${body};\n`;
writeFileSync(resolve(here, '../src/elements.ts'), out, 'utf8');
console.log(`generated ${light.length} elements -> elements.ts (light) + elements-db.json (full)`);
