// «Fun facts» по элементам: 10 фактов на элемент (заголовок + текст), мультиязычно.
// Данные лежат по языкам в funFacts.<lang>.json (Record<symbol, {title,text}[]>),
// сгенерированы и собраны скриптом web/scripts/merge-facts.mjs.
// EN заполнен для всех 118; RU/HY наполняются переводом (пока пусто → фолбэк на EN).
import en from './funFacts.en.json';
import ru from './funFacts.ru.json';
import hy from './funFacts.hy.json';

type Loc = Partial<Record<'en' | 'ru' | 'hy', string>>;
export interface FunFact {
  title: Loc;
  text: Loc;
}

type Raw = Record<string, { title: string; text: string }[]>;
const EN = en as Raw;
const RU = ru as Raw;
const HY = hy as Raw;

export const FUN_FACTS: Record<string, FunFact[]> = {};
for (const sym of Object.keys(EN)) {
  FUN_FACTS[sym] = EN[sym]!.map((f, i) => ({
    title: { en: f.title, ru: RU[sym]?.[i]?.title, hy: HY[sym]?.[i]?.title },
    text: { en: f.text, ru: RU[sym]?.[i]?.text, hy: HY[sym]?.[i]?.text },
  }));
}
