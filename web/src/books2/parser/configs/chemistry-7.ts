import type { TextbookConfig, MarkerRule, LessonMeta, KeywordTerm } from '../types';
import lessons from '../data/chemistry-7.lessons.json';
import keywords from '../data/chemistry-7.keywords.json';
import markers from '../data/chemistry-7.markers.json';

// Конфиг конкретного учебника = семантика (маркеры) + метаданные (уроки, словарь).
// Движок (ruleParser) общий; здесь нет логики — только данные. Для нового учебника — свой конфиг.
export const CHEMISTRY_7_CONFIG: TextbookConfig = {
  bookId: 'chemistry-7',
  lessons: lessons as LessonMeta[],
  keywords: keywords as KeywordTerm[],
  markers: markers as MarkerRule[],
};
