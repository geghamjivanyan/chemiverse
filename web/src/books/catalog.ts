// Каталог учебников: класс → предмет → учебник (PDF + метаданные).
// Добавить учебник = одна запись здесь + положить PDF в public/textbooks/.
export type Subject = 'chemistry' | 'physics' | 'biology' | 'geography';

export interface Textbook {
  id: string;
  grade: number; // класс
  subject: Subject;
  title: { en: string; ru: string; hy: string };
  author?: string;
  year?: number;
  file: string; // путь к PDF в public
  pages?: number;
  lang: 'hy' | 'ru' | 'en';
}

export const SUBJECT_LABEL: Record<Subject, { en: string; ru: string; hy: string }> = {
  chemistry: { en: 'Chemistry', ru: 'Химия', hy: 'Քիմիա' },
  physics: { en: 'Physics', ru: 'Физика', hy: 'Ֆիզիկա' },
  biology: { en: 'Biology', ru: 'Биология', hy: 'Կենսաբանություն' },
  geography: { en: 'Geography', ru: 'География', hy: 'Աշխարհագրություն' },
};

export const TEXTBOOKS: Textbook[] = [
  {
    id: 'chemistry-7',
    grade: 7,
    subject: 'chemistry',
    title: { en: 'Chemistry 7', ru: 'Химия 7', hy: 'Քիմիա 7' },
    author: 'Ք. Բդոյան, Զ. Կարապետյան, Մ. Գափոյան',
    year: 2023,
    file: '/textbooks/chemistry-7.pdf',
    pages: 168,
    lang: 'hy',
  },
  {
    id: 'chemistry-7.2',
    grade: 7,
    subject: 'chemistry',
    title: { en: 'Chemistry 7.2', ru: 'Химия 7.2', hy: 'Քիմիա 7.2' },
    author: 'Ք. Բդոյան, Զ. Կարապետյան, Մ. Գափոյան',
    year: 2023,
    file: '/textbooks/chemistry-7.pdf',
    pages: 168,
    lang: 'hy',
  },
  {
    id: 'physics-7',
    grade: 7,
    subject: 'physics',
    title: { en: 'Physics 7', ru: 'Физика 7', hy: 'Ֆիզիկա 7' },
    author: 'Գ. Մելիքյան, Ս. Մաիլյան',
    year: 2023,
    file: '/textbooks/physics-7.pdf',
    pages: 168,
    lang: 'hy',
  },
  {
    // Golden Lesson sandbox — rendered by the concept-based Block System (no PDF).
    id: 'atom-structure',
    grade: 7,
    subject: 'chemistry',
    title: { en: 'Atom Structure', ru: 'Строение атома', hy: 'Ատոմի կառուցվածք' },
    year: 2026,
    file: '',
    lang: 'en',
  },
];

export const GRADES = [...new Set(TEXTBOOKS.map((t) => t.grade))].sort((a, b) => a - b);
export const byId = (id: string) => TEXTBOOKS.find((t) => t.id === id) ?? null;
