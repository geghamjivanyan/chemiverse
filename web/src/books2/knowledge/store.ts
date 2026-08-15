import type { Lesson, LearningBlock } from '../model';
import type { KnowledgeEntity, EntityType } from './model';
import { ENTITY_MAP, ENTITY_SEED } from './entities';

export const ENTITY_TYPE_LABEL: Record<EntityType, string> = {
  chemical_element: 'Քիմիական տարր', substance: 'Նյութ', compound: 'Միացություն', molecule: 'Մոլեկուլ', atom: 'Ատոմ',
  scientific_term: 'Գիտական տերմին', law: 'Օրենք', scientist: 'Գիտնական', laboratory_equipment: 'Լաբորատոր սարք', experiment: 'Փորձ',
  process: 'Գործընթաց', measurement: 'Չափում', unit: 'Միավոր', formula: 'Բանաձև', reaction: 'Ռեակցիա', symbol: 'Նշան', other: 'Հասկացություն',
};

// блоки, где встречается сущность (matKey ИЛИ имя/алиас в заголовке/описании)
function appearances(seed: { name: string; aliases: string[]; matKey?: string }, lessons: Lesson[]): LearningBlock[] {
  const names = [seed.name, ...seed.aliases].map((s) => s.toLowerCase()).filter((s) => s.length >= 3);
  const out: LearningBlock[] = [];
  for (const l of lessons) for (const b of l.learningBlocks) {
    if (seed.matKey && b.matKey === seed.matKey) { out.push(b); continue; }
    const hay = `${b.title} ${b.description ?? ''}`.toLowerCase();
    if (names.some((n) => hay.includes(n))) out.push(b);
  }
  return out;
}

// гидрированная сущность: статика + вычисленные «где встречается»
export function getEntity(id: string, lessons: Lesson[]): KnowledgeEntity | null {
  const seed = ENTITY_MAP.get(id);
  if (!seed) return null;
  const blocks = appearances(seed, lessons);
  return {
    ...seed,
    relatedLearningBlocks: blocks.map((b) => b.id),
    lessonIds: [...new Set(blocks.map((b) => b.lessonId))],
    pageNumbers: [...new Set(blocks.map((b) => b.page))].sort((a, b) => a - b),
  };
}

export const relatedBlocks = (entity: KnowledgeEntity, lessons: Lesson[]): LearningBlock[] => {
  const ids = new Set(entity.relatedLearningBlocks);
  return lessons.flatMap((l) => l.learningBlocks).filter((b) => ids.has(b.id));
};

export const relatedConcepts = (entity: KnowledgeEntity) =>
  entity.relatedEntities.map((id) => ENTITY_MAP.get(id)).filter((e): e is NonNullable<typeof e> => !!e);

// matKey → id сущности (для клика по keyword в книге)
export const resolveByMat = (matKey: string): string | null =>
  ENTITY_MAP.has(matKey) ? matKey : (ENTITY_SEED.find((e) => e.matKey === matKey)?.id ?? null);
