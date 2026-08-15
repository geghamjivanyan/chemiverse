import type { TextbookConfig, MarkerRule, LessonMeta, KeywordTerm } from '../types';
import lessons from '../data/physics-7.lessons.json';
import keywords from '../data/physics-7.keywords.json';
import markers from '../data/physics-7.markers.json';

// Конфиг учебника «Ֆիզիկա 7» — семантика (маркеры) + метаданные (уроки, словарь).
// Движок (ruleParser) общий; здесь нет логики — только данные.
export const PHYSICS_7_CONFIG: TextbookConfig = {
  bookId: 'physics-7',
  lessons: lessons as LessonMeta[],
  keywords: keywords as KeywordTerm[],
  markers: markers as MarkerRule[],
};
