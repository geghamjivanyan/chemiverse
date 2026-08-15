// Knowledge Graph: сущности знаний переиспользуются по всему учебнику.
// Learning Blocks отвечают за ПРОГРЕСС («что учить»), Knowledge Entities — за ЗНАНИЕ («что это»).
export type EntityType =
  | 'chemical_element' | 'substance' | 'compound' | 'molecule' | 'atom'
  | 'scientific_term' | 'law' | 'scientist' | 'laboratory_equipment' | 'experiment'
  | 'process' | 'measurement' | 'unit' | 'formula' | 'reaction' | 'symbol' | 'other';

export interface KnowledgeEntity {
  id: string;
  name: string;
  type: EntityType;
  description: string;
  aliases: string[];
  relatedEntities: string[];        // id связанных сущностей (рёбра графа)
  relatedLearningBlocks: string[];  // id блоков (вычисляется/сидируется)
  lessonIds: string[];
  pageNumbers: number[];

  // future-ready (опциональны; добавление контента НЕ меняет модель):
  matKey?: string;          // связь с 3D-знанием (элемент/молекула/материал)
  formula?: string;
  resources?: { kind: 'image' | 'video' | '3d' | 'external' | 'flashcard' | 'quiz'; url?: string; label?: string }[];
  crossSubject?: string[];  // ссылки на другие предметы
  metadata?: Record<string, unknown>; // ИИ-объяснения, рекомендации и т.п.
}
