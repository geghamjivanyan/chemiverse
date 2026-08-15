// Кликабельные ячейки поверх книжной таблицы (внутри страницы — едут с прокруткой).
// Ключ — НОМЕР ФАЙЛА. 65 = печатная 64 (периодическая система).
export interface Embed {
  kind: 'periodic-table';
  region: { x: number; y: number; w: number; h: number }; // bbox таблицы (доли страницы, Docling)
  // инсеты внутри region: шапка (номера групп), подписи периодов, зазор f-блока
  grid: { padT: number; padL: number; padR: number; padB: number; gap: number };
}

export const EMBED_PAGES: Record<string, Record<number, Embed>> = {
  'chemistry-7': {
    65: {
      kind: 'periodic-table',
      region: { x: 0.113, y: 0.309, w: 0.801, h: 0.376 },
      grid: { padT: 0.07, padL: 0.03, padR: 0.0, padB: 0.0, gap: 0.5 },
    },
  },
};
