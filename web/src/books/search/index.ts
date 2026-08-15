import chem7 from './chemistry-7.json';
import phys7 from './physics-7.json';

// Текстовый индекс книги по страницам (для поиска/сниппетов): id → [текст стр.1, …].
export const BOOK_TEXT: Record<string, string[]> = {
  'chemistry-7': chem7 as string[],
  'physics-7': phys7 as string[],
};
