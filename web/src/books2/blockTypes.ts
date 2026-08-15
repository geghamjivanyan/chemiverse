import type { BlockType, Confidence } from './model';

// Իկon + армянское название типа Learning Block (для UI).
export const TYPE_META: Record<BlockType, { icon: string; label: string }> = {
  reading: { icon: '📖', label: 'Ընթերցանություն' },
  definition: { icon: '🧠', label: 'Սահմանում' },
  law: { icon: '⚖️', label: 'Օրենք' },
  keyword: { icon: '🔑', label: 'Բանալի բառ' },
  think: { icon: '💡', label: 'Մտածիր' },
  reflect: { icon: '🤔', label: 'Կշռադատիր' },
  recall: { icon: '🔄', label: 'Վերհիշիր' },
  laboratory: { icon: '🧪', label: 'Լաբորատոր' },
  question: { icon: '❓', label: 'Հարց' },
  additional_material: { icon: '📚', label: 'Լրացուցիչ նյութ' },
};

// Формулировка задачи плана обучения (армянский).
export const taskLabel: Record<BlockType, (n: number) => string> = {
  reading: () => 'Կարդալ դասը',
  definition: (n) => `Սովորել ${n} սահմանում`,
  law: (n) => `Սովորել ${n} օրենք`,
  keyword: (n) => `Սովորել ${n} բանալի բառ`,
  think: (n) => `Կատարել «Մտածիր»՝ ${n}`,
  reflect: (n) => `Կատարել «Կշռադատիր»՝ ${n}`,
  recall: (n) => `Կատարել «Վերհիշիր»՝ ${n}`,
  laboratory: (n) => `Կատարել ${n} լաբորատոր աշխատանք`,
  question: (n) => `Պատասխանել ${n} հարցի`,
  additional_material: (n) => `Դիտել ${n} նյութ`,
};

// Уровни уверенности (My Study)
export const CONFIDENCE_META: { id: Confidence; emoji: string; label: string; ring: string; bg: string }[] = [
  { id: 'low', emoji: '🟥', label: 'Չեմ հասկանում', ring: 'border-red-500/50', bg: 'bg-red-500/15 text-red-400' },
  { id: 'mid', emoji: '🟨', label: 'Մասամբ', ring: 'border-amber-500/50', bg: 'bg-amber-500/15 text-amber-400' },
  { id: 'high', emoji: '🟩', label: 'Հասկանում եմ', ring: 'border-emerald-500/50', bg: 'bg-emerald-500/15 text-emerald-400' },
];
