// Базовые типы предметной области CHEMVERSE.
// Источник правды о химии. Без зависимостей от React/three.
// Подробности модели — /var/www/claude/docs/03-chemistry-model.md

export type ElementCategory =
  | 'nonmetal'
  | 'noble-gas'
  | 'alkali-metal'
  | 'alkaline-earth-metal'
  | 'metalloid'
  | 'halogen'
  | 'transition-metal'
  | 'post-transition-metal'
  | 'lanthanide'
  | 'actinide'
  | 'unknown';

export type Block = 's' | 'p' | 'd' | 'f';
export type Phase = 'solid' | 'liquid' | 'gas' | 'unknown';

/** Поддерживаемые языки интерфейса и локализованных названий. */
export type Locale = 'en' | 'hy' | 'ru';

/** Локализованный текст по языкам. */
export type LocalizedText = Record<Locale, string>;

/** Элемент таблицы Менделеева. */
export interface Element {
  z: number; // атомный номер = число протонов
  symbol: string; // "H", "O", "Na"
  names: LocalizedText; // названия по языкам (en/hy/ru)
  mass: number; // средняя атомная масса
  neutrons: number; // нейтронов в самом распространённом изотопе ≈ round(mass) - z
  period: number;
  group: number; // 1..18 (для f-блока — номинальная группа 3)
  block: Block;
  category: ElementCategory;
  shells: number[]; // электроны по оболочкам, напр. O = [2, 6]
  electronConfig: string; // семантическая запись, напр. "[He] 2s2 2p4"
  valence: number[]; // типичные валентности (для синтетических — пусто)
  electronegativity: number | null; // по Полингу
  phase: Phase; // агрегатное состояние при н.у.
  color: string; // CPK-цвет (#hex)
  xpos: number; // позиция в сетке 1..18 (f-блок вынесен)
  ypos: number; // ряд 1..7 + ряды 9..10 для лантаноидов/актиноидов
  // расширенные данные (для учебных профилей)
  density: number | null; // г/см³ (или г/л для газа)
  melt: number | null; // K
  boil: number | null; // K
  molarHeat: number | null; // Дж/(моль·K)
  electronAffinity: number | null; // кДж/моль
  ionizationEnergies: number[]; // кДж/моль
  discoveredBy: string | null;
  namedBy: string | null;
  appearance: string | null;
  source: string; // ссылка на источник (Wikipedia)
  atomicRadius: number | null; // пм (PubChem)
  oxidationStates: number[]; // степени окисления (PubChem)
  yearDiscovered: string | null; // год открытия ("1774" | "Ancient")
  isotopes: { mass: number; abundance: number }[]; // природные изотопы (массовое число, % распространённости)
}

/** Полная запись элемента (в БД/API): добавляет тяжёлое описание (не в бандле). */
export interface ElementFull extends Element {
  description: LocalizedText; // краткое описание (en/ru/hy, из Wikipedia)
}

/** Конкретный атом на сцене. */
export interface Atom {
  id: string;
  z: number;
  neutrons: number; // A - Z для выбранного изотопа
}

export interface Bond {
  a: number; // индекс атома в molecule.atoms
  b: number;
  order: 1 | 2 | 3;
}

export type BondType = 'covalent' | 'ionic' | 'metallic';

/** Молекула — результат реакции, с 3D-геометрией. */
export interface Molecule {
  formula: string; // "H2O"
  names: LocalizedText; // локализованное название
  atoms: { z: number; pos: [number, number, number] }[];
  bonds: Bond[];
  bondType: BondType;
}

/** Рецепт: какой набор атомов во что складывается. */
export interface Reaction {
  reactants: Record<string, number>; // { H: 2, O: 1 }
  product: Molecule;
}
