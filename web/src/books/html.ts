// Учебники, отрендеренные pdf2htmlEX постранично (визуально идентично PDF, текст живой).
// id → база пути + число страниц; страницы лежат как <base>/p<N>.html (самодостаточные).
export interface WebBook {
  base: string;
  pages: number; // всего файлов-страниц (включая обложку/титул)
  offset?: number; // сколько передних страниц не считать (обложка и т.п.): показ № = pdf − offset
}

export const WEB_BOOK: Record<string, WebBook> = {
  'chemistry-7': { base: '/textbooks/chemistry-7', pages: 170, offset: 1 },
  // экспериментальный ридер 7.2 — тот же контент (HTML-страницы общие)
  'chemistry-7.2': { base: '/textbooks/chemistry-7', pages: 170, offset: 1 },
  'physics-7': { base: '/textbooks/physics-7', pages: 170, offset: 1 },
};
