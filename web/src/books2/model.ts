// Архитектура учебной платформы: Learning Block — ядро. Урок владеет блоками; страницы — нет.
export type BlockType =
  | 'reading'
  | 'definition'
  | 'law'
  | 'keyword'
  | 'think'
  | 'reflect'
  | 'recall'
  | 'laboratory'
  | 'question'
  | 'additional_material';

// Уровень уверенности ученика по блоку: 🟥 не понимаю · 🟨 частично · 🟩 понимаю
export type Confidence = 'low' | 'mid' | 'high';

export interface LearningBlock {
  id: string;
  lessonId: string;
  page: number;
  type: BlockType;
  title: string;
  description?: string;
  completed: boolean;
  favorite: boolean;
  note?: string;
  confidence?: Confidence;
  source?: { page: number; index: number }; // откуда извлечён блок (страница + позиция в тексте)
  matKey?: string; // расширение: keyword → карточка знаний (элемент/вещество)
}

export interface Lesson {
  id: string;
  title: string;
  chapter: string;
  pageStart: number;
  pageEnd: number;
  learningBlocks: LearningBlock[];
}
