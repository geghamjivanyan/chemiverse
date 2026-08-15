import { describe, it, expect } from 'vitest';
import { reactions, matchReaction, parseFormula } from './reactions';
import { bySymbol } from './periodic';

describe('parseFormula', () => {
  it('разбирает формулы', () => {
    expect(parseFormula('H2O')).toEqual({ H: 2, O: 1 });
    expect(parseFormula('CO2')).toEqual({ C: 1, O: 2 });
    expect(parseFormula('NaCl')).toEqual({ Na: 1, Cl: 1 });
    expect(parseFormula('NH3')).toEqual({ N: 1, H: 3 });
    expect(parseFormula('O3')).toEqual({ O: 3 });
  });
});

describe('база реакций', () => {
  it('формулы уникальны', () => {
    const f = reactions.map((r) => r.product.formula);
    expect(new Set(f).size).toBe(f.length);
  });

  it('реактанты совпадают с формулой продукта', () => {
    for (const r of reactions) {
      expect(r.reactants, r.product.formula).toEqual(parseFormula(r.product.formula));
    }
  });

  it('наборы реактантов уникальны (нет коллизий распознавания)', () => {
    const keys = reactions.map((r) =>
      Object.entries(r.reactants)
        .sort()
        .map(([k, v]) => `${k}${v}`)
        .join(''),
    );
    expect(new Set(keys).size).toBe(keys.length);
  });

  it('у каждой молекулы есть названия на en/hy/ru', () => {
    for (const r of reactions) {
      const m = r.product;
      expect(m.names.en.length, m.formula).toBeGreaterThan(0);
      expect(m.names.hy.length, m.formula).toBeGreaterThan(0);
      expect(m.names.ru.length, m.formula).toBeGreaterThan(0);
    }
  });

  it('геометрия: число атомов = сумме атомов формулы; связи ссылаются на валидные индексы', () => {
    for (const r of reactions) {
      const m = r.product;
      const total = Object.values(r.reactants).reduce((a, b) => a + b, 0);
      expect(m.atoms.length, m.formula).toBe(total);
      for (const b of m.bonds) {
        expect(b.a).toBeGreaterThanOrEqual(0);
        expect(b.a).toBeLessThan(m.atoms.length);
        expect(b.b).toBeLessThan(m.atoms.length);
        expect(b.a).not.toBe(b.b);
      }
    }
  });

  it('состав атомов в геометрии соответствует формуле', () => {
    for (const r of reactions) {
      const m = r.product;
      const got: Record<string, number> = {};
      for (const a of m.atoms) {
        const sym = [...bySymbol.values()].find((e) => e.z === a.z)!.symbol;
        got[sym] = (got[sym] ?? 0) + 1;
      }
      expect(got, m.formula).toEqual(r.reactants);
    }
  });

  it('атомы центрированы (центроид ≈ 0)', () => {
    for (const r of reactions) {
      const m = r.product;
      let cx = 0;
      let cy = 0;
      let cz = 0;
      for (const a of m.atoms) {
        cx += a.pos[0];
        cy += a.pos[1];
        cz += a.pos[2];
      }
      const n = m.atoms.length;
      for (const v of [cx, cy, cz]) expect(Math.abs(v / n), m.formula).toBeLessThan(1e-9);
    }
  });
});

describe('matchReaction', () => {
  it('2H + O → H2O', () => {
    expect(matchReaction({ H: 2, O: 1 })?.product.formula).toBe('H2O');
  });
  it('C + 2O → CO2', () => {
    expect(matchReaction({ C: 1, O: 2 })?.product.formula).toBe('CO2');
  });
  it('различает O2 и O3', () => {
    expect(matchReaction({ O: 2 })?.product.formula).toBe('O2');
    expect(matchReaction({ O: 3 })?.product.formula).toBe('O3');
  });
  it('нули игнорируются', () => {
    expect(matchReaction({ H: 2, O: 1, C: 0 })?.product.formula).toBe('H2O');
  });
  it('неизвестная комбинация → null', () => {
    expect(matchReaction({ H: 5, O: 3 })).toBeNull();
    expect(matchReaction({})).toBeNull();
  });
});
