import { useState, type ReactElement, type ReactNode } from 'react';
import { Home, BookOpen, RotateCcw, Library, Play, CheckCircle2, Circle, Network, Search as SearchIcon, ChevronRight, StickyNote } from 'lucide-react';
import type { Lesson, LearningBlock } from './model';
import { LearningDashboard } from './LearningDashboard';
import { TYPE_META, taskLabel } from './blockTypes';
import { ENTITY_TYPE_LABEL } from './knowledge/store';
import { ENTITY_MAP } from './knowledge/entities';
import { overallPercent, completedCount, totalBlocks, firstIncomplete, lessonComplete, allBlocks, chapters, studyPlan, lessonPercent, type StudyFilter } from './store';
import { reviewQueue, todaysGoal } from './derive';
import { relTime, type ActivityEvent } from './activity';

type Tab = 'home' | 'lessons' | 'review' | 'library';
const TABS: { id: Tab; icon: typeof Home; label: string }[] = [
  { id: 'home', icon: Home, label: 'Գլխավոր' }, { id: 'lessons', icon: BookOpen, label: 'Դասեր' },
  { id: 'review', icon: RotateCcw, label: 'Կրկնություն' }, { id: 'library', icon: Library, label: 'Գրադարան' },
];

type RowFn = (p: { b: LearningBlock }) => ReactElement;

interface HubProps {
  lessons: Lesson[]; activity: ActivityEvent[]; selectedId: string | null; filter: StudyFilter;
  setFilter: (f: StudyFilter) => void;
  onOpenBlock: (b: LearningBlock) => void; onContinue: () => void; onOpenLesson: (id: string) => void; onNavigateEntity: (id: string) => void;
}

export function StudyHub(props: HubProps) {
  const { lessons, activity, onOpenBlock, onContinue, onOpenLesson, onNavigateEntity } = props;
  const [tab, setTab] = useState<Tab>('home');

  const Row: RowFn = ({ b }) => (
    <button onClick={() => onOpenBlock(b)} className="flex w-full items-center gap-1.5 rounded px-1.5 py-1 text-left text-xs hover:bg-accent">
      {b.completed ? <CheckCircle2 className="size-3.5 shrink-0 text-primary" /> : <span className="size-3.5 shrink-0" />}
      <span className="shrink-0 text-sm leading-none">{TYPE_META[b.type].icon}</span>
      <span className={`line-clamp-1 flex-1 ${b.completed ? 'text-muted-foreground/70' : 'text-foreground/80'}`}>{b.title}</span>
    </button>
  );

  return (
    <div className="flex h-full min-h-0 flex-col rounded-lg border bg-card/20">
      <div className="flex shrink-0 gap-0.5 border-b p-1">
        {TABS.map((t) => (
          <button key={t.id} onClick={() => setTab(t.id)} title={t.label}
            className={`flex flex-1 flex-col items-center gap-0.5 rounded-md py-1.5 text-[10px] transition ${tab === t.id ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:bg-accent'}`}>
            <t.icon className="size-4" />{t.label}
          </button>
        ))}
      </div>

      {tab === 'lessons' ? (
        <LearningDashboard {...props} embedded navOnly />
      ) : tab === 'home' ? (
        <HomeTab lessons={lessons} onOpenBlock={onOpenBlock} onContinue={onContinue} />
      ) : tab === 'review' ? (
        <ReviewTab lessons={lessons} activity={activity} onOpenBlock={onOpenBlock} Row={Row} />
      ) : (
        <LibraryTab lessons={lessons} activity={activity} onOpenBlock={onOpenBlock} onOpenLesson={onOpenLesson} onNavigateEntity={onNavigateEntity} />
      )}
    </div>
  );
}

const Section = ({ title, children }: { title: string; children: ReactNode }) => (
  <div>
    <div className="mb-1 px-1 text-[11px] font-medium uppercase tracking-wide text-muted-foreground">{title}</div>
    {children}
  </div>
);

// «My Study» + «Ընթացիկ դասը» — личный дашборд: действия важнее статистики.
// Study GPS. Приоритет сверху вниз: ① Շարունակել (единственный акцент — очевидное «что дальше»)
// → ② Այսօրվա նպատակ → ③ Ընդհանուր առաջընթաց → │разделитель│ → ④ Ընթացիկ դասը.
// (⑤ Դասեր, ⑥ Կրկնություն, ⑦ Գրադարան — это вкладки-назначения.)
function HomeTab({ lessons, onOpenBlock, onContinue }: {
  lessons: Lesson[];
  onOpenBlock: (b: LearningBlock) => void; onContinue: () => void;
}) {
  const ov = overallPercent(lessons);
  const cont = firstIncomplete(lessons);
  const contLesson = cont ? lessons.find((l) => l.id === cont.lessonId) : null;
  const chap = chapters(lessons).find((c) => c.lessons.some((l) => !lessonComplete(l)));
  const goal = todaysGoal(lessons);

  return (
    <div className="min-h-0 flex-1 overflow-auto p-2">
      {/* ═══ MY STUDY ═══ */}
      <div className="space-y-2.5">
        {/* ① Продолжить — единственный акцентный блок: очевидное «что делать сейчас» */}
        {cont && (
          <Section title="Շարունակել ուսումը">
            <div className="rounded-lg border border-primary/30 bg-primary/5 p-2.5">
              <div className="line-clamp-1 text-[11px] text-muted-foreground">{contLesson?.title}{chap ? ` · ${chap.chapter}` : ''}</div>
              <div className="line-clamp-1 text-sm font-medium">{TYPE_META[cont.type].icon} {cont.title}</div>
              <button onClick={onContinue} className="mt-1.5 flex w-full items-center justify-center gap-1.5 rounded-md bg-primary px-3 py-1.5 text-sm font-medium text-primary-foreground hover:opacity-90"><Play className="size-3.5 fill-current" /> Շարունակել</button>
            </div>
          </Section>
        )}

        {/* ② Цель дня — тише, чем «Продолжить» */}
        <Section title="Այսօրվա նպատակ">
          <div className="rounded-lg border bg-card/40 p-2.5">
            <div className="text-sm font-medium">{goal.text}</div>
            <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-secondary"><div className="h-full rounded-full bg-primary" style={{ width: `${goal.total ? (goal.done / goal.total) * 100 : 0}%` }} /></div>
            <div className="mt-0.5 text-[11px] text-muted-foreground tabular-nums">{goal.done}/{goal.total}</div>
          </div>
        </Section>

        {/* ③ Общий прогресс — пассивная сводка, самый тихий блок (% + завершённые блоки) */}
        <Section title="Ընդհանուր առաջընթաց">
          <div className="rounded-lg border bg-card/40 p-2.5">
            <div className="text-sm font-semibold tabular-nums text-foreground">{ov}%</div>
            <div className="mt-0.5 text-[11px] text-muted-foreground tabular-nums">{completedCount(lessons)} / {totalBlocks(lessons)} ուսումնական բլոկ</div>
          </div>
        </Section>
      </div>

      {/* ═══ CURRENT LESSON ═══ (крупный разделитель: переход My Study → Ընթացիկ դասը) */}
      {contLesson && (
        <div className="mt-3 space-y-2.5 border-t pt-3">
          <Section title="Ընթացիկ դասը">
            <div className="rounded-lg border bg-card/40 p-2.5">
              <div className="line-clamp-2 text-sm font-medium">{contLesson.title}</div>
              <div className="mt-1.5 flex items-center gap-2">
                <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-secondary"><div className="h-full rounded-full bg-primary" style={{ width: `${lessonPercent(contLesson)}%` }} /></div>
                <span className="shrink-0 text-[11px] tabular-nums text-muted-foreground">{lessonPercent(contLesson)}%</span>
              </div>
              <div className="mt-1.5 space-y-0.5">
                {studyPlan(contLesson).map((t) => {
                  const target = t.firstIncomplete ?? contLesson.learningBlocks.find((b) => b.type === t.type) ?? null;
                  const complete = t.done === t.total;
                  return (
                    <button key={t.type} onClick={() => target && onOpenBlock(target)} className="flex w-full items-center gap-1.5 rounded px-1.5 py-1 text-left text-xs hover:bg-accent">
                      {complete ? <CheckCircle2 className="size-3.5 shrink-0 text-primary" /> : <Circle className="size-3.5 shrink-0 text-muted-foreground/40" />}
                      <span className="shrink-0">{TYPE_META[t.type].icon}</span>
                      <span className="line-clamp-1 flex-1 text-foreground/80">{taskLabel[t.type](t.total)}</span>
                      <span className="shrink-0 text-[10px] tabular-nums text-muted-foreground">{t.done}/{t.total}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </Section>
        </div>
      )}
    </div>
  );
}

function ReviewTab({ lessons, activity, onOpenBlock, Row }: { lessons: Lesson[]; activity: ActivityEvent[]; onOpenBlock: (b: LearningBlock) => void; Row: RowFn }) {
  const queue = reviewQueue(lessons, activity);
  return (
    <div className="min-h-0 flex-1 space-y-2 overflow-auto p-2">
      <div className="rounded-lg border bg-card/40 p-2.5">
        <div className="text-sm font-semibold">Կրկնության հերթ</div>
        <div className="text-[11px] text-muted-foreground">{queue.length} միավոր</div>
        {queue[0] && <button onClick={() => onOpenBlock(queue[0]!)} className="mt-1.5 flex w-full items-center justify-center gap-1.5 rounded-md bg-primary px-3 py-1.5 text-sm font-medium text-primary-foreground hover:opacity-90"><Play className="size-3.5 fill-current" /> Սկսել կրկնությունը</button>}
      </div>
      <div className="space-y-0.5">{queue.slice(0, 60).map((b) => <Row key={b.id} b={b} />)}</div>
    </div>
  );
}

type LibSort = 'all' | 'recent' | 'alpha' | 'lesson';
const LIB_SORTS: { id: LibSort; label: string }[] = [
  { id: 'all', label: 'Բոլորը' }, { id: 'recent', label: 'Վերջին' },
  { id: 'alpha', label: 'Այբբենական' }, { id: 'lesson', label: 'Ըստ դասի' },
];

// «Իմ ուսումնական տարածքը» — личный архив: только то, что студент сохранил / завершил / создал.
// Всё выводится из существующих моделей (Lesson/LearningBlock/сущности) — своих копий нет.
function LibraryTab({ lessons, activity, onOpenBlock, onOpenLesson, onNavigateEntity }: {
  lessons: Lesson[]; activity: ActivityEvent[];
  onOpenBlock: (b: LearningBlock) => void; onOpenLesson: (id: string) => void; onNavigateEntity: (id: string) => void;
}) {
  const [q, setQ] = useState('');
  const [sort, setSort] = useState<LibSort>('all');
  const query = q.toLowerCase().trim();

  const lessonById = new Map(lessons.map((l) => [l.id, l]));
  const lessonTitle = (b: LearningBlock) => lessonById.get(b.lessonId)?.title ?? '';
  const tsOf = (kind: ActivityEvent['kind'], id: string) => activity.find((e) => e.kind === kind && e.refId === id)?.ts;
  const blocks = allBlocks(lessons);

  const matchB = (b: LearningBlock) => !query || b.title.toLowerCase().includes(query) || lessonTitle(b).toLowerCase().includes(query) || (b.note ?? '').toLowerCase().includes(query);
  const sortB = (arr: LearningBlock[]) => {
    const a = [...arr];
    if (sort === 'alpha') a.sort((x, y) => x.title.localeCompare(y.title, 'hy'));
    else if (sort === 'lesson') a.sort((x, y) => lessonTitle(x).localeCompare(lessonTitle(y), 'hy'));
    else if (sort === 'recent') a.sort((x, y) => (tsOf('complete', y.id) ?? tsOf('note', y.id) ?? 0) - (tsOf('complete', x.id) ?? tsOf('note', x.id) ?? 0));
    return a;
  };

  // ⭐ избранные блоки (без matKey) + избранные сущности знаний (из keyword-блоков с matKey)
  const favBlocks = sortB(blocks.filter((b) => b.favorite && !b.matKey && matchB(b)));
  const favEntities: { id: string; name: string; type: string }[] = [];
  { const seen = new Set<string>();
    for (const b of blocks) if (b.favorite && b.matKey) { const e = ENTITY_MAP.get(b.matKey); if (e && !seen.has(e.id) && (!query || e.name.toLowerCase().includes(query))) { seen.add(e.id); favEntities.push({ id: e.id, name: e.name, type: e.type }); } } }

  const notes = sortB(blocks.filter((b) => (b.note ?? '').trim() !== '' && matchB(b)));
  const lessonDoneAt = (l: Lesson) => Math.max(0, ...l.learningBlocks.map((b) => tsOf('complete', b.id) ?? 0));
  const compLessons = lessons.filter(lessonComplete).filter((l) => !query || l.title.toLowerCase().includes(query))
    .sort((x, y) => sort === 'alpha' ? x.title.localeCompare(y.title, 'hy') : lessonDoneAt(y) - lessonDoneAt(x));
  const defs = sortB(blocks.filter((b) => b.completed && b.type === 'definition' && matchB(b)));
  const keywords = sortB(blocks.filter((b) => b.completed && b.type === 'keyword' && matchB(b)));
  const labs = sortB(blocks.filter((b) => b.completed && b.type === 'laboratory' && matchB(b)));

  const emptyState = (text: string) => <div className="px-1.5 py-1 text-[11px] text-muted-foreground">{text}</div>;

  // Строка Learning Block: иконка · название · урок (+дата) · «открыть»
  const openRow = (b: LearningBlock, showDate = false) => {
    const ts = tsOf('complete', b.id);
    return (
      <button key={b.id} onClick={() => onOpenBlock(b)} className="flex w-full items-center gap-1.5 rounded px-1.5 py-1 text-left text-xs hover:bg-accent">
        <span className="shrink-0 text-sm leading-none">{TYPE_META[b.type].icon}</span>
        <span className="min-w-0 flex-1">
          <span className="line-clamp-1 text-foreground/80">{b.title}</span>
          <span className="line-clamp-1 text-[10px] text-muted-foreground">{lessonTitle(b)}{showDate && ts ? ` · ${relTime(ts)}` : ''}</span>
        </span>
        <ChevronRight className="size-3.5 shrink-0 text-muted-foreground/50" />
      </button>
    );
  };

  return (
    <div className="flex min-h-0 flex-1 flex-col p-2">
      {/* Поиск только по Библиотеке (независим от поиска по учебнику) */}
      <div className="relative mb-2 shrink-0">
        <SearchIcon className="pointer-events-none absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
        <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Որոնել գրադարանում…" className="h-9 w-full rounded-md border bg-background pl-8 pr-3 text-sm outline-none focus:ring-1 focus:ring-ring" />
      </div>
      {/* Лёгкая сортировка */}
      <div className="mb-2 grid shrink-0 grid-cols-4 gap-1 text-[11px]">
        {LIB_SORTS.map((s) => (
          <button key={s.id} onClick={() => setSort(s.id)} className={`rounded px-1 py-1 transition ${sort === s.id ? 'bg-primary text-primary-foreground' : 'bg-card/30 text-muted-foreground hover:text-foreground'}`}>{s.label}</button>
        ))}
      </div>

      <div className="min-h-0 flex-1 space-y-2.5 overflow-auto">
        {/* ⭐ Избранное: блоки + сущности знаний */}
        <Section title={`⭐ Ընտրանի · ${favBlocks.length + favEntities.length}`}>
          {favBlocks.length || favEntities.length ? (
            <>
              {favBlocks.map((b) => openRow(b))}
              {favEntities.map((e) => (
                <button key={e.id} onClick={() => onNavigateEntity(e.id)} className="flex w-full items-center gap-1.5 rounded px-1.5 py-1 text-left text-xs hover:bg-accent">
                  <Network className="size-3.5 shrink-0 text-primary" /><span className="line-clamp-1 flex-1">{e.name}</span>
                  <span className="shrink-0 text-[10px] text-muted-foreground">{ENTITY_TYPE_LABEL[e.type as keyof typeof ENTITY_TYPE_LABEL]}</span>
                </button>
              ))}
            </>
          ) : emptyState('Դեռ ընտրանի չկա։')}
        </Section>

        {/* 📝 Заметки */}
        <Section title={`📝 Նշումներ · ${notes.length}`}>
          {notes.length ? notes.map((b) => {
            const ts = tsOf('note', b.id);
            return (
              <button key={b.id} onClick={() => onOpenBlock(b)} className="flex w-full items-start gap-1.5 rounded px-1.5 py-1 text-left text-xs hover:bg-accent">
                <StickyNote className="mt-0.5 size-3 shrink-0 text-muted-foreground/60" />
                <span className="min-w-0 flex-1">
                  <span className="line-clamp-1 text-foreground/80">{b.title}</span>
                  <span className="line-clamp-1 text-[11px] text-muted-foreground">{b.note}</span>
                  <span className="line-clamp-1 text-[10px] text-muted-foreground">{lessonTitle(b)} · {TYPE_META[b.type].label}{ts ? ` · ${relTime(ts)}` : ''}</span>
                </span>
              </button>
            );
          }) : emptyState('Դեռ նշումներ չկան։')}
        </Section>

        {/* 📖 Завершённые уроки */}
        <Section title={`📖 Ավարտված դասեր · ${compLessons.length}`}>
          {compLessons.length ? compLessons.map((l) => {
            const ts = lessonDoneAt(l);
            return (
              <button key={l.id} onClick={() => onOpenLesson(l.id)} className="flex w-full items-center gap-1.5 rounded px-1.5 py-1 text-left text-xs hover:bg-accent">
                <CheckCircle2 className="size-3.5 shrink-0 text-primary" />
                <span className="min-w-0 flex-1">
                  <span className="line-clamp-1 text-foreground/80">{l.title}</span>
                  {ts > 0 && <span className="line-clamp-1 text-[10px] text-muted-foreground">{relTime(ts)}</span>}
                </span>
                <span className="shrink-0 text-[10px] font-medium tabular-nums text-primary">100%</span>
              </button>
            );
          }) : emptyState('Դեռ ավարտված դասեր չկան։')}
        </Section>

        {/* 🧠 Изученные определения */}
        <Section title={`🧠 Սովորած սահմանումներ · ${defs.length}`}>
          {defs.length ? defs.map((b) => openRow(b)) : emptyState('Ավարտի՛ր սահմանումները՝ հավաքածուդ կազմելու համար։')}
        </Section>

        {/* 🔑 Изученные ключевые слова */}
        <Section title={`🔑 Սովորած բանալի բառեր · ${keywords.length}`}>
          {keywords.length ? keywords.map((b) => openRow(b)) : emptyState('Ավարտի՛ր բանալի բառերը՝ հավաքածուդ կազմելու համար։')}
        </Section>

        {/* 🧪 Завершённые лаборатории */}
        <Section title={`🧪 Ավարտված լաբորատոր · ${labs.length}`}>
          {labs.length ? labs.map((b) => openRow(b, true)) : emptyState('Դեռ ավարտված լաբորատոր աշխատանք չկա։')}
        </Section>
      </div>
    </div>
  );
}

