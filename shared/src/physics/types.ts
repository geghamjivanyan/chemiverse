// Типы физического модуля CHEMVERSE: нуклиды, частицы, константы, спектры.
// Источник правды — датасеты в shared/data/physics/ (см. SOURCES.md там же).
// Без зависимостей от React/three.

/** Мода распада по нотации ENSDF/IAEA: B- (бета-минус), B+ (бета-плюс/EC), A (альфа), SF, N, P, IT… */
export interface DecayBranch {
  mode: string;
  /** Доля в процентах, если известна (у экзотических ядер может отсутствовать). */
  pct?: number;
}

export interface Nuclide {
  z: number;
  n: number;
  symbol: string;
  /** Спин и чётность основного состояния, как в ENSDF: "1/2+", "0+", "(3/2-)". */
  jp?: string;
  /** Атомная масса в u (из AME2020). */
  mass?: number;
  /** Избыток массы, кэВ. */
  massExcessKeV?: number;
  /** Энергия связи на нуклон, кэВ. */
  bindingKeVPerA?: number;
  /** Период полураспада в секундах; отсутствует у стабильных. */
  halfLifeSec?: number;
  /** Человекочитаемый период: value+unit как в источнике ("12.32 y"). */
  halfLife?: string;
  stable: boolean;
  /** Распространённость в природе, мольные % (только у природных нуклидов). */
  abundance?: number;
  decays: DecayBranch[];
  /** Год открытия. */
  discoveryYear?: number;
}

export interface Particle {
  /** Имя PDG: "e-", "mu+", "pi0", "p", "Delta(1232)++"… */
  name: string;
  /** PDG Monte Carlo ID (стандартный числовой код частицы). */
  mcid: number;
  /** PDG Identifier ("S003"…) — ключ обратно в базу PDG. */
  pdgid: string;
  /** Электрический заряд в единицах e. */
  charge: number | null;
  /** Спин J ("1/2", "1"…), чётности P/C, изоспин I, G-чётность. */
  quantumJ?: string;
  quantumP?: string;
  quantumC?: string;
  quantumI?: string;
  quantumG?: string;
  /** Масса, МэВ (сводное значение PDG). */
  massMeV?: number;
  massErrMeV?: number;
  /** Среднее время жизни, с. */
  lifetimeSec?: number;
  /** Полная ширина, МэВ (для резонансов). */
  widthMeV?: number;
}

export interface PhysConstant {
  /** Ключ-слаг из имени CODATA: "electron-mass", "speed-of-light-in-vacuum"… */
  id: string;
  /** Имя как в CODATA. */
  name: string;
  value: number;
  /** Абсолютная погрешность; 0 — точная (зафиксированная СИ) константа. */
  uncertainty: number;
  unit: string;
  exact: boolean;
}

export interface SpectralLine {
  /** Длина волны в нм (воздух). */
  nm: number;
  /** Относительная интенсивность из NIST ASD (безразмерная, в пределах элемента). */
  intensity: number;
}

export interface ElementSpectrum {
  z: number;
  symbol: string;
  /** Суммарный «цвет свечения» элемента, sRGB hex. */
  color: string;
  /** Сильнейшие видимые линии (до 12), по убыванию интенсивности. */
  lines: SpectralLine[];
}
