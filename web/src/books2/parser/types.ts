import type { BlockType, Lesson } from '../model';

// Универсальный контракт парсера учебника. Движок не знает о химии —
// всю семантику задаёт конфиг конкретного учебника (маркеры/уроки/метаданные).

// Правило извлечения блоков одного типа:
//  • patterns — текстовые маркеры рубрики (скан страницы), ИЛИ
//  • pages    — явные страницы из метаданных (по блоку на страницу).
export interface MarkerRule {
  type: BlockType;
  patterns?: string[];
  pages?: number[];
}

// Термин-keyword (метаданные словаря учебника).
export interface KeywordTerm {
  term: string;       // как встречается в тексте
  display?: string;   // отображаемый заголовок
  matKey?: string;    // связка с карточкой знаний (необязательно)
}

// Метаданные урока (границы по странице старта; конец вычисляется).
export interface LessonMeta {
  page: number;
  title: string;
  chapter?: string;
}

export interface TextbookConfig {
  bookId: string;
  lessons: LessonMeta[];
  markers: MarkerRule[];
  keywords?: KeywordTerm[];
}

// Источник для парсера: текст книги по печатным страницам (pages[i] = страница i).
export interface TextbookSource {
  pages: string[]; // индекс = печатная страница (pages[0] — обложка/перед уроками)
}

// Контракт реализации парсера (правиловый сейчас, AI — позже; сигнатура та же).
export type Parser = (source: TextbookSource, config: TextbookConfig) => Lesson[];
