import type { PageHotspots } from './hotspots';

// Хотспоты «Ֆիզիկա 7»: на страницах, где вводится величина/закон, армянское
// название кликабельно → карточка знаний с формулой (books2/knowledge).
// Ключ карты — НОМЕР ФАЙЛА (pdf-страница) = печатная страница + 1.
// key — id сущности из knowledge/entities-physics.ts.

// concept: [текст, id сущности, печатные страницы от..до]
const CONCEPTS: [text: string, key: string, from: number, to: number][] = [
  ['մեխանիկական շարժում', 'mechanical_motion', 42, 44],
  ['ճանապարհ', 'path', 45, 48],
  ['արագություն', 'speed', 49, 53],
  ['զանգված', 'mass', 60, 62],
  ['խտություն', 'density', 63, 67],
  ['ուժ', 'force', 71, 73],
  ['ծանրության ուժ', 'gravity_force', 74, 78],
  ['առաձգականության ուժ', 'elastic_force', 79, 82],
  ['Հուկի օրենք', 'elastic_force', 79, 82],
  ['կշիռ', 'weight', 85, 86],
  ['շփման ուժ', 'friction_force', 87, 91],
  ['աշխատանք', 'work', 99, 101],
  ['հզորություն', 'power', 102, 104],
  ['լծակ', 'lever', 105, 107],
  ['օգտակար գործողության գործակից', 'efficiency', 112, 113],
  ['ՕԳԳ', 'efficiency', 112, 116],
  ['ճնշում', 'pressure', 118, 120],
  ['Պասկալի օրենք', 'pascal_law', 125, 127],
  ['հիդրոստատիկ ճնշում', 'hydrostatic_pressure', 128, 130],
  ['մթնոլորտային ճնշում', 'atmospheric_pressure', 140, 145],
  ['Արքիմեդի օրենք', 'archimedes_law', 148, 151],
];

const map: Record<number, PageHotspots> = {};
for (const [text, key, from, to] of CONCEPTS) {
  for (let printed = from; printed <= to; printed++) {
    const pdf = printed + 1;
    const page = (map[pdf] ??= { words: [] });
    // более длинные шаблоны раньше — «ծանրության ուժ» должен победить «ուժ»
    page.words!.push({ text, key });
  }
}
// сортировка слов по убыванию длины в каждой странице
for (const p of Object.values(map)) p.words!.sort((a, b) => b.text.length - a.text.length);

export const PHYSICS_HOTSPOTS: Record<number, PageHotspots> = map;
