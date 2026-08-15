import { elements } from '@chemverse/shared';

// Глобальный словарь интерактива: применяется на КАЖДОЙ странице автоматически.
// Армянское название элемента → его символ (правая панель = карточка элемента).
export const EL_WORDS: { text: string; key: string }[] = elements.map((e) => ({ text: e.names.hy, key: e.symbol }));

// Частые вещества/материалы/молекулы (основа слова → ключ в MATERIALS).
export const SUBSTANCE_WORDS: { text: string; key: string }[] = [
  { text: 'Ապակ', key: 'glass' },
  { text: 'ռետին', key: 'rubber' },
  { text: 'փայտ', key: 'wood' },
  { text: 'բամբակ', key: 'cotton' },
  { text: 'կավ', key: 'clay' },
  { text: 'պարաֆին', key: 'paraffin' },
  { text: 'ջուր', key: 'water' },
];

// латинские названия элементов (часто в заголовках уроков) → символ
export const LATIN_WORDS: { text: string; key: string }[] = [
  { text: 'Hydrogenium', key: 'H' }, { text: 'Helium', key: 'He' }, { text: 'Lithium', key: 'Li' },
  { text: 'Beryllium', key: 'Be' }, { text: 'Borum', key: 'B' }, { text: 'Carboneum', key: 'C' },
  { text: 'Nitrogenium', key: 'N' }, { text: 'Oxygenium', key: 'O' }, { text: 'Fluorum', key: 'F' },
  { text: 'Natrium', key: 'Na' }, { text: 'Magnesium', key: 'Mg' }, { text: 'Aluminium', key: 'Al' },
  { text: 'Silicium', key: 'Si' }, { text: 'Phosphorus', key: 'P' }, { text: 'Sulfur', key: 'S' },
  { text: 'Chlorum', key: 'Cl' }, { text: 'Kalium', key: 'K' }, { text: 'Calcium', key: 'Ca' },
  { text: 'Manganum', key: 'Mn' }, { text: 'Ferrum', key: 'Fe' }, { text: 'Cuprum', key: 'Cu' },
  { text: 'Zincum', key: 'Zn' }, { text: 'Argentum', key: 'Ag' }, { text: 'Stannum', key: 'Sn' },
  { text: 'Stibium', key: 'Sb' }, { text: 'Iodum', key: 'I' }, { text: 'Aurum', key: 'Au' },
  { text: 'Hydrargyrum', key: 'Hg' }, { text: 'Plumbum', key: 'Pb' }, { text: 'Wolframium', key: 'W' },
  { text: 'Cuprum', key: 'Cu' }, { text: 'Argon', key: 'Ar' },
];

// длинные сначала — чтобы более конкретное слово перехватывало раньше
export const GLOBAL_WORDS = [...EL_WORDS, ...LATIN_WORDS, ...SUBSTANCE_WORDS]
  .sort((a, b) => b.text.length - a.text.length);
