import { describe, it, expect } from 'vitest';
import { elements } from './elements';
import { byZ, bySymbol, getElement, CATEGORY_ORDER } from './periodic';

describe('датасет элементов', () => {
  it('ровно 118 элементов', () => {
    expect(elements).toHaveLength(118);
  });

  it('Z идут непрерывно 1..118 и уникальны', () => {
    const zs = elements.map((e) => e.z);
    expect(zs).toEqual(Array.from({ length: 118 }, (_, i) => i + 1));
  });

  it('символы уникальны', () => {
    expect(new Set(elements.map((e) => e.symbol)).size).toBe(118);
  });

  it('сумма электронов по оболочкам равна Z (нейтральный атом)', () => {
    for (const e of elements) {
      expect(e.shells.reduce((a, b) => a + b, 0), `${e.symbol}`).toBe(e.z);
    }
  });

  it('нейтроны неотрицательны и согласованы с массой', () => {
    for (const e of elements) {
      expect(e.neutrons).toBeGreaterThanOrEqual(0);
      expect(e.neutrons).toBe(Math.max(0, Math.round(e.mass) - e.z));
    }
  });

  it('grid-позиции в допустимых пределах', () => {
    for (const e of elements) {
      expect(e.xpos, e.symbol).toBeGreaterThanOrEqual(1);
      expect(e.xpos, e.symbol).toBeLessThanOrEqual(18);
      expect(e.ypos, e.symbol).toBeGreaterThanOrEqual(1);
      expect(e.ypos, e.symbol).toBeLessThanOrEqual(10);
    }
  });

  it('каждая позиция в сетке занята не более чем одним элементом', () => {
    const seen = new Set<string>();
    for (const e of elements) {
      const key = `${e.xpos}:${e.ypos}`;
      expect(seen.has(key), `дубль позиции у ${e.symbol}`).toBe(false);
      seen.add(key);
    }
  });

  it('цвет — валидный #hex', () => {
    for (const e of elements) {
      expect(e.color, e.symbol).toMatch(/^#[0-9a-fA-F]{6}$/);
    }
  });

  it('у каждого элемента есть названия на en/hy/ru', () => {
    for (const e of elements) {
      expect(e.names.en.length, e.symbol).toBeGreaterThan(0);
      expect(e.names.hy.length, e.symbol).toBeGreaterThan(0);
      expect(e.names.ru.length, e.symbol).toBeGreaterThan(0);
      // русское имя — кириллица, армянское — армянский алфавит
      expect(e.names.ru, e.symbol).toMatch(/[А-Яа-яё]/);
      expect(e.names.hy, e.symbol).toMatch(/[԰-֏]/);
    }
  });

  it('категория входит в известный набор', () => {
    for (const e of elements) {
      expect(CATEGORY_ORDER, e.symbol).toContain(e.category);
    }
  });

  it('валентности есть у всех, кроме сверхтяжёлых (Z>=104)', () => {
    for (const e of elements) {
      if (e.z < 104) expect(e.valence.length, e.symbol).toBeGreaterThan(0);
    }
  });

  it('группа 17 — галогены, группа 18 — благородные газы', () => {
    expect(bySymbol.get('Cl')?.category).toBe('halogen');
    expect(bySymbol.get('F')?.category).toBe('halogen');
    expect(bySymbol.get('Ar')?.category).toBe('noble-gas');
  });
});

describe('хелперы', () => {
  it('byZ / bySymbol находят элемент', () => {
    expect(byZ.get(8)?.symbol).toBe('O');
    expect(bySymbol.get('Fe')?.z).toBe(26);
  });

  it('getElement принимает Z и символ', () => {
    expect(getElement(1)?.symbol).toBe('H');
    expect(getElement('Na')?.z).toBe(11);
    expect(getElement('Xx')).toBeUndefined();
  });
});
