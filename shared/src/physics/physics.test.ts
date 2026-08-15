import { describe, expect, it } from 'vitest';
import { nuclides } from './nuclides';
import { particles } from './particles';
import { PHYS, physConstants } from './constants';
import { spectra, spectrumOf } from './spectra';

describe('нуклиды (IAEA/AME2020)', () => {
  it('полная карта: >3300 нуклидов, 244 стабильных', () => {
    expect(nuclides.length).toBeGreaterThan(3300);
    expect(nuclides.filter((x) => x.stable)).toHaveLength(244);
  });

  it('H-1: стабилен, масса ≈ 1.00783 u, распространённость ≈ 99.99 %', () => {
    const h1 = nuclides.find((x) => x.z === 1 && x.n === 0)!;
    expect(h1.stable).toBe(true);
    expect(h1.mass).toBeCloseTo(1.007825, 5);
    expect(h1.abundance).toBeGreaterThan(99.9);
  });

  it('U-238: альфа-распад, T½ ≈ 4.468 млрд лет', () => {
    const u238 = nuclides.find((x) => x.z === 92 && x.n === 146)!;
    expect(u238.stable).toBe(false);
    expect(u238.decays[0]?.mode).toBe('A');
    // 4.468e9 лет в секундах ≈ 1.41e17
    expect(u238.halfLifeSec! / 1.41e17).toBeCloseTo(1, 1);
  });

  it('свободный нейтрон: β-распад, T½ ≈ 614 с', () => {
    const n = nuclides.find((x) => x.z === 0 && x.n === 1)!;
    expect(n.decays[0]?.mode).toBe('B-');
    expect(n.halfLifeSec).toBeCloseTo(613.9, 0);
  });
});

describe('частицы (PDG 2026)', () => {
  const byName = (name: string) => particles.find((p) => p.name === name)!;

  it('электрон: заряд −1, масса ≈ 0.511 МэВ', () => {
    const e = byName('e-');
    expect(e.mcid).toBe(11);
    expect(e.charge).toBe(-1);
    expect(e.massMeV).toBeCloseTo(0.51099895, 5);
  });

  it('протон ≈ 938.272 МэВ, мюон живёт ≈ 2.197 мкс', () => {
    expect(byName('p').massMeV).toBeCloseTo(938.272, 2);
    expect(byName('mu-').lifetimeSec).toBeCloseTo(2.197e-6, 8);
  });

  it('фотон безмассов, Z-бозон ≈ 91.19 ГэВ', () => {
    const gamma = particles.find((p) => p.mcid === 22)!;
    expect(gamma.massMeV ?? 0).toBe(0);
    const z0 = particles.find((p) => p.mcid === 23)!;
    expect(z0.massMeV! / 1000).toBeCloseTo(91.19, 1);
  });

  it('кварки u/d/s/c/b/t присутствуют (mcid 1–6)', () => {
    for (let id = 1; id <= 6; id++) {
      expect(particles.some((p) => p.mcid === id)).toBe(true);
    }
  });
});

describe('константы (CODATA 2022)', () => {
  it('точные константы СИ: c, h, e, NA, kB', () => {
    expect(PHYS.c.value).toBe(299792458);
    expect(PHYS.c.exact).toBe(true);
    expect(PHYS.h.value).toBeCloseTo(6.62607015e-34, 42);
    expect(PHYS.e.value).toBeCloseTo(1.602176634e-19, 27);
    expect(PHYS.NA.value).toBeCloseTo(6.02214076e23, -15);
    expect(PHYS.kB.value).toBeCloseTo(1.380649e-23, 29);
  });

  it('измеряемые: G с ненулевой погрешностью, α ≈ 1/137', () => {
    expect(PHYS.G.value).toBeCloseTo(6.674e-11, 13);
    expect(PHYS.G.uncertainty).toBeGreaterThan(0);
    expect(1 / PHYS.alpha.value).toBeCloseTo(137.036, 2);
  });

  it('весь список CODATA на месте', () => {
    expect(physConstants.length).toBeGreaterThan(300);
  });
});

describe('спектры (NIST ASD)', () => {
  it('покрытие: ~97 элементов, у тяжёлых трансфермиевых спектров нет', () => {
    expect(spectra.length).toBeGreaterThan(90);
    expect(spectrumOf('Md')).toBeUndefined();
  });

  it('водород: линия Бальмера Hα ≈ 656.3 нм среди сильнейших', () => {
    const h = spectrumOf('H')!;
    expect(h.lines.some((l) => Math.abs(l.nm - 656.28) < 0.5)).toBe(true);
  });

  it('натрий: жёлтый дублет ≈ 589 нм, цвет свечения тёплый (R ≥ G > B)', () => {
    const na = spectrumOf('Na')!;
    expect(na.lines.some((l) => Math.abs(l.nm - 589) < 1)).toBe(true);
    const [r, g, b] = [1, 3, 5].map((i) => parseInt(na.color.slice(i, i + 2), 16)) as [number, number, number];
    expect(r).toBeGreaterThanOrEqual(g);
    expect(g).toBeGreaterThan(b);
  });

  it('цвета валидные hex, линии в видимом диапазоне', () => {
    for (const s of spectra) {
      expect(s.color).toMatch(/^#[0-9a-f]{6}$/);
      for (const l of s.lines) {
        expect(l.nm).toBeGreaterThanOrEqual(380);
        expect(l.nm).toBeLessThanOrEqual(780);
      }
    }
  });
});
