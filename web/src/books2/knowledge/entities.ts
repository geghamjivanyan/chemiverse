import seed from './data/entities.json';
import type { KnowledgeEntity, EntityType } from './model';
import { PHYSICS_ENTITIES } from './entities-physics';

// Концептуальные сущности — ядро графа знаний и его навигация (армянский).
const CONCEPTUAL: Omit<KnowledgeEntity, 'relatedLearningBlocks' | 'lessonIds' | 'pageNumbers'>[] = [
  { id: 'atom', name: 'Ատոմ', type: 'atom', description: 'Քիմիական տարրի ամենափոքր մասնիկը, որը պահպանում է նրա հատկությունները։', aliases: ['ատոմ', 'atom'], relatedEntities: ['electron', 'nucleus', 'chemical_element', 'molecule'] },
  { id: 'electron', name: 'Էլեկտրոն', type: 'scientific_term', description: 'Բացասական լիցքով մասնիկ, որը շարժվում է ատոմի միջուկի շուրջ։', aliases: ['էլեկտրոն', 'electron'], relatedEntities: ['atom', 'electric_charge', 'ion'] },
  { id: 'nucleus', name: 'Ատոմի միջուկ', type: 'scientific_term', description: 'Ատոմի կենտրոնական մասը՝ պրոտոններից և նեյտրոններից։', aliases: ['միջուկ', 'nucleus'], relatedEntities: ['atom', 'electron'] },
  { id: 'electric_charge', name: 'Էլեկտրական լիցք', type: 'measurement', description: 'Ֆիզիկական մեծություն, որը որոշում է էլեկտրամագնիսական փոխազդեցությունը։', aliases: ['լիցք', 'electric charge'], relatedEntities: ['electron', 'ion'] },
  { id: 'ion', name: 'Իոն', type: 'scientific_term', description: 'Էլեկտրական լիցք ունեցող ատոմ կամ ատոմների խումբ։', aliases: ['իոն', 'ion'], relatedEntities: ['electric_charge', 'chemical_bond', 'atom'] },
  { id: 'chemical_bond', name: 'Քիմիական կապ', type: 'scientific_term', description: 'Փոխազդեցություն, որը միասին է պահում ատոմները մոլեկուլներում և նյութերում։', aliases: ['կապ', 'chemical bond'], relatedEntities: ['ion', 'molecule', 'atom'] },
  { id: 'molecule', name: 'Մոլեկուլ', type: 'molecule', description: 'Քիմիական կապերով միացած ատոմների խումբ։', aliases: ['մոլեկուլ', 'molecule'], relatedEntities: ['chemical_bond', 'atom', 'substance'] },
  { id: 'substance', name: 'Նյութ', type: 'substance', description: 'Այն, ինչից կազմված են ֆիզիկական մարմինները։', aliases: ['նյութ', 'substance'], relatedEntities: ['molecule', 'compound'] },
  { id: 'compound', name: 'Միացություն', type: 'compound', description: 'Տարբեր տարրերի ատոմներից կազմված նյութ։', aliases: ['միացություն', 'compound'], relatedEntities: ['substance', 'molecule', 'reaction'] },
  { id: 'reaction', name: 'Քիմիական ռեակցիա', type: 'reaction', description: 'Մի նյութերի փոխարկումը մյուսների։', aliases: ['ռեակցիա', 'reaction'], relatedEntities: ['compound', 'process'] },
  { id: 'process', name: 'Գործընթաց', type: 'process', description: 'Նյութի կամ համակարգի փոփոխությունների հաջորդականություն։', aliases: ['գործընթաց', 'process'], relatedEntities: ['reaction'] },
];

type SeedEntity = Omit<KnowledgeEntity, 'relatedLearningBlocks' | 'lessonIds' | 'pageNumbers'> & { type: EntityType };

// Реестр всех сущностей (без вычисляемых полей — их добавляет store при запросе).
export const ENTITY_SEED: SeedEntity[] = [...(seed as SeedEntity[]), ...CONCEPTUAL, ...PHYSICS_ENTITIES];

export const ENTITY_MAP = new Map<string, SeedEntity>(ENTITY_SEED.map((e) => [e.id, e]));
