// Физический модуль CHEMVERSE: нуклиды (IAEA/AME2020), частицы (PDG 2026),
// константы (CODATA 2022), спектры (NIST ASD). Всё — генерируемые данные,
// см. shared/scripts/generate-*.mjs и shared/data/physics/SOURCES.md.
export * from './types';
export { nuclides } from './nuclides';
export { particles } from './particles';
export { physConstants, PHYS, constantById } from './constants';
export { spectra, spectrumOf } from './spectra';
