import type { BlockType, Lesson, LearningBlock } from '../model';
import type { Parser } from './types';

const clean = (s: string) => s.replace(/\s+/g, ' ').trim();
const cut = (s: string, n: number) => { s = clean(s); return s.length > n ? s.slice(0, n).trim() + '…' : s; };

const TYPE_TITLE: Record<BlockType, string> = {
  reading: 'Reading', definition: 'Definition', law: 'Law', keyword: 'Keyword',
  think: 'Think', reflect: 'Reflect', recall: 'Recall', laboratory: 'Laboratory',
  question: 'Question', additional_material: 'Additional material',
};

/**
 * Универсальный правиловый парсер: распознаёт СЕМАНТИКУ маркеров (из конфига), не контент.
 * Подходит для любого учебника — вся специфика в TextbookConfig. Позже заменяется AI-парсером
 * с той же сигнатурой (Parser) — UI и модель не меняются.
 */
export const ruleParser: Parser = (source, config) => {
  const pages = source.pages;
  const meta = [...config.lessons].sort((a, b) => a.page - b.page);
  if (meta.length === 0) return [];

  // 1) уроки и их границы (страница — только локация)
  const lessons: Lesson[] = meta.map((m, i) => ({
    id: `${config.bookId}:lesson-${i + 1}`,
    title: m.title,
    chapter: m.chapter ?? `Chapter ${Math.floor(i / 8) + 1}`,
    pageStart: m.page,
    pageEnd: i + 1 < meta.length ? meta[i + 1]!.page - 1 : Math.max(m.page, pages.length - 1),
    learningBlocks: [],
  }));
  const firstPage = lessons[0]!.pageStart;
  const lessonIdFor = (page: number) => {
    let li = 0;
    for (let i = 0; i < lessons.length; i++) { if (lessons[i]!.pageStart <= page) li = i; else break; }
    return lessons[li]!.id;
  };

  const blocks: LearningBlock[] = [];
  const add = (type: BlockType, page: number, title: string, index: number, extra?: Partial<LearningBlock>) => {
    const lessonId = lessonIdFor(page);
    blocks.push({
      id: `${lessonId}:${type}-p${page}-${index}`,
      lessonId, page, type,
      title: title || TYPE_TITLE[type],
      completed: false, favorite: false,
      source: { page, index },
      ...extra,
    });
  };

  // 2) reading-блок на старте каждого урока
  for (const l of lessons) {
    blocks.push({ id: `${l.id}:reading`, lessonId: l.id, page: l.pageStart, type: 'reading', title: l.title, completed: false, favorite: false, source: { page: l.pageStart, index: 0 } });
  }

  // 3) маркер-блоки: по тексту (patterns) или по метаданным (pages)
  for (const rule of config.markers) {
    if (rule.patterns?.length) {
      for (let p = firstPage; p < pages.length; p++) {
        const text = pages[p] ?? '';
        let idx = -1;
        for (const pat of rule.patterns) { const k = text.indexOf(pat); if (k >= 0 && (idx < 0 || k < idx)) idx = k; }
        if (idx < 0) continue;
        add(rule.type, p, cut(text.slice(idx, idx + 90), 46), idx);
      }
    }
    if (rule.pages?.length) {
      for (const p of rule.pages) {
        if (p < 1 || p >= pages.length) continue;
        add(rule.type, p, cut(pages[p] ?? '', 46), 0);
      }
    }
  }

  // 4) keyword-блоки: первый встреченный термин словаря
  for (const kw of config.keywords ?? []) {
    let page = -1, index = -1;
    for (let p = 1; p < pages.length; p++) { const k = (pages[p] ?? '').indexOf(kw.term); if (k >= 0) { page = p; index = k; break; } }
    if (page < 0) continue;
    const lessonId = lessonIdFor(page);
    blocks.push({
      id: `${config.bookId}:kw-${kw.matKey ?? kw.term}`,
      lessonId, page, type: 'keyword', title: kw.display ?? kw.term,
      completed: false, favorite: false, source: { page, index },
      ...(kw.matKey ? { matKey: kw.matKey } : {}),
    });
  }

  // 5) разложить по урокам, reading первым
  const byId = new Map(lessons.map((l) => [l.id, l]));
  for (const b of blocks) byId.get(b.lessonId)?.learningBlocks.push(b);
  for (const l of lessons) l.learningBlocks.sort((a, b) =>
    a.type === 'reading' ? -1 : b.type === 'reading' ? 1 : a.page - b.page || (a.source?.index ?? 0) - (b.source?.index ?? 0));
  return lessons;
};
