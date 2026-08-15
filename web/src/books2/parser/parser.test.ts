import { describe, expect, it } from 'vitest';
import { ruleParser } from './engine';
import { BOOK_TEXT } from '../../books/search';
import { CHEMISTRY_7_CONFIG } from './configs/chemistry-7';
import { PHYSICS_7_CONFIG } from './configs/physics-7';

describe('ruleParser: physics-7', () => {
  const lessons = ruleParser({ pages: BOOK_TEXT['physics-7'] ?? [] }, PHYSICS_7_CONFIG);

  it('парсит все 55 уроков (§1–§55)', () => {
    expect(lessons).toHaveLength(55);
  });

  it('уроки сгруппированы в 6 глав', () => {
    expect(new Set(lessons.map((l) => l.chapter)).size).toBe(6);
  });

  it('в каждом уроке есть блоки, у каждого блока валидная страница', () => {
    for (const l of lessons) {
      expect(l.learningBlocks.length).toBeGreaterThan(0);
      for (const b of l.learningBlocks) {
        expect(b.page).toBeGreaterThanOrEqual(1);
        expect(b.page).toBeLessThanOrEqual(170);
      }
    }
  });

  it('находит лабораторные и вопросы (маркеры сработали)', () => {
    const types = new Set(lessons.flatMap((l) => l.learningBlocks.map((b) => b.type)));
    expect(types.has('laboratory')).toBe(true);
    expect(types.has('question')).toBe(true);
  });
});

describe('ruleParser: chemistry-7 (регрессия — поведение не должно меняться)', () => {
  it('парсится с непустыми уроками', () => {
    const lessons = ruleParser({ pages: BOOK_TEXT['chemistry-7'] ?? [] }, CHEMISTRY_7_CONFIG);
    expect(lessons.length).toBeGreaterThan(0);
    expect(lessons.flatMap((l) => l.learningBlocks).length).toBeGreaterThan(0);
  });
});
