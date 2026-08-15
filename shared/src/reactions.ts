import type { BondType, LocalizedText, Molecule, Reaction } from './types';
import { bySymbol } from './periodic';
import { diatomic, linear, bent, tetrahedral, pyramidal, type Geometry } from './chem';

const Z = (sym: string): number => {
  const e = bySymbol.get(sym);
  if (!e) throw new Error(`неизвестный элемент: ${sym}`);
  return e.z;
};

/**
 * Формула по системе Хилла из счётчика символов (идентично ingest-скрипту):
 * есть углерод → C, затем H, затем остальные по алфавиту; иначе всё по алфавиту.
 * { H:2, O:1 } -> "H2O"; { C:1, H:4 } -> "CH4".
 */
export function hillFormula(counts: Record<string, number>): string {
  const keys = Object.keys(counts).filter((k) => counts[k]! > 0);
  const ordered: string[] = [];
  if (counts.C) {
    ordered.push('C');
    if (counts.H) ordered.push('H');
    ordered.push(...keys.filter((k) => k !== 'C' && k !== 'H').sort());
  } else {
    ordered.push(...keys.sort());
  }
  return ordered.map((k) => (counts[k]! > 1 ? `${k}${counts[k]}` : k)).join('');
}

/** "H2O" -> { H: 2, O: 1 } */
export function parseFormula(formula: string): Record<string, number> {
  const counts: Record<string, number> = {};
  for (const m of formula.matchAll(/([A-Z][a-z]?)(\d*)/g)) {
    if (!m[1]) continue;
    counts[m[1]] = (counts[m[1]] ?? 0) + (m[2] ? Number(m[2]) : 1);
  }
  return counts;
}

function mol(formula: string, names: LocalizedText, bondType: BondType, geo: Geometry): Molecule {
  return { formula, names, atoms: geo.atoms, bonds: geo.bonds, bondType };
}

function rx(m: Molecule): Reaction {
  return { reactants: parseFormula(m.formula), product: m };
}

// сокращение для трёх языков
const n = (en: string, hy: string, ru: string): LocalizedText => ({ en, hy, ru });

export const reactions: Reaction[] = [
  // — ковалентные двухатомные —
  rx(mol('H2', n('Hydrogen', 'Ջրածին', 'Водород'), 'covalent', diatomic(Z('H'), Z('H'), 1))),
  rx(mol('O2', n('Oxygen', 'Թթվածին', 'Кислород'), 'covalent', diatomic(Z('O'), Z('O'), 2))),
  rx(mol('N2', n('Nitrogen', 'Ազոտ', 'Азот'), 'covalent', diatomic(Z('N'), Z('N'), 3))),
  rx(mol('Cl2', n('Chlorine', 'Քլոր', 'Хлор'), 'covalent', diatomic(Z('Cl'), Z('Cl'), 1))),
  rx(mol('HCl', n('Hydrogen chloride', 'Ջրածնի քլորիդ', 'Хлороводород'), 'covalent', diatomic(Z('H'), Z('Cl'), 1))),
  rx(mol('HF', n('Hydrogen fluoride', 'Ջրածնի ֆտորիդ', 'Фтороводород'), 'covalent', diatomic(Z('H'), Z('F'), 1))),
  rx(mol('CO', n('Carbon monoxide', 'Ածխածնի մոնօքսիդ', 'Угарный газ'), 'covalent', diatomic(Z('C'), Z('O'), 3))),
  rx(mol('NO', n('Nitric oxide', 'Ազոտի օքսիդ', 'Оксид азота(II)'), 'covalent', diatomic(Z('N'), Z('O'), 2))),

  // — ковалентные угловые / линейные / объёмные —
  rx(mol('H2O', n('Water', 'Ջուր', 'Вода'), 'covalent', bent(Z('O'), Z('H'), 104.5, 1))),
  rx(mol('H2S', n('Hydrogen sulfide', 'Ջրածնի սուլֆիդ', 'Сероводород'), 'covalent', bent(Z('S'), Z('H'), 92, 1))),
  rx(mol('O3', n('Ozone', 'Օզոն', 'Озон'), 'covalent', bent(Z('O'), Z('O'), 117, 1))),
  rx(mol('SO2', n('Sulfur dioxide', 'Ծծմբի երկօքսիդ', 'Диоксид серы'), 'covalent', bent(Z('S'), Z('O'), 119, 2))),
  rx(mol('NO2', n('Nitrogen dioxide', 'Ազոտի երկօքսիդ', 'Диоксид азота'), 'covalent', bent(Z('N'), Z('O'), 134, 1))),
  rx(mol('CO2', n('Carbon dioxide', 'Ածխածնի երկօքսիդ', 'Углекислый газ'), 'covalent', linear(Z('C'), Z('O'), 2))),
  rx(mol('NH3', n('Ammonia', 'Ամոնիակ', 'Аммиак'), 'covalent', pyramidal(Z('N'), Z('H'), 107, 1))),
  rx(mol('CH4', n('Methane', 'Մեթան', 'Метан'), 'covalent', tetrahedral(Z('C'), Z('H'), 1))),

  // — ионные —
  rx(mol('NaCl', n('Sodium chloride', 'Նատրիումի քլորիդ', 'Хлорид натрия'), 'ionic', diatomic(Z('Na'), Z('Cl'), 1))),
  rx(mol('KCl', n('Potassium chloride', 'Կալիումի քլորիդ', 'Хлорид калия'), 'ionic', diatomic(Z('K'), Z('Cl'), 1))),
  rx(mol('MgO', n('Magnesium oxide', 'Մագնեզիումի օքսիդ', 'Оксид магния'), 'ionic', diatomic(Z('Mg'), Z('O'), 1))),
  rx(mol('CaO', n('Calcium oxide', 'Կալցիումի օքսիդ', 'Оксид кальция'), 'ionic', diatomic(Z('Ca'), Z('O'), 1))),
  rx(mol('LiF', n('Lithium fluoride', 'Լիթիումի ֆտորիդ', 'Фторид лития'), 'ionic', diatomic(Z('Li'), Z('F'), 1))),
];

const sameCounts = (a: Record<string, number>, b: Record<string, number>): boolean => {
  const keys = new Set([...Object.keys(a), ...Object.keys(b)]);
  for (const k of keys) if ((a[k] ?? 0) !== (b[k] ?? 0)) return false;
  return true;
};

/** Подобрать реакцию по набору атомов (мультимножество символов). */
export function matchReaction(counts: Record<string, number>): Reaction | null {
  const clean: Record<string, number> = {};
  for (const [k, v] of Object.entries(counts)) if (v > 0) clean[k] = v;
  if (Object.keys(clean).length === 0) return null;
  return reactions.find((r) => sameCounts(r.reactants, clean)) ?? null;
}

/** Все известные молекулы (для «журнала открытий» и подсказок). */
export const moleculeCount = reactions.length;
