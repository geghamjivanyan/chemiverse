import { useEffect, useMemo, useRef, useState } from 'react';
import { ChevronRight, LayoutDashboard, Star, CheckCircle2, Circle, Play, AlertCircle, Filter } from 'lucide-react';
import type { Lesson, LearningBlock } from './model';
import { TYPE_META } from './blockTypes';
import {
  chapters, studyPlan, lessonPercent, chapterComplete,
  reviewList, matchFilter, firstIncomplete, overallPercent, completedCount, totalBlocks, favoritesCount,
  type StudyFilter,
} from './store';

const FILTERS: { id: StudyFilter; label: string }[] = [
  { id: 'all', label: 'Բոլորը' }, { id: 'incomplete', label: 'Անավարտ' }, { id: 'completed', label: 'Ավարտված' },
  { id: 'favorites', label: 'Ընտրանի' }, { id: 'review', label: 'Կրկնություն' }, { id: 'notes', label: 'Նշումներով' },
];

/** Personal study workspace: статистика урока, быстрые фильтры, Needs Review, завершённость. Источник — Learning Blocks. */
export function LearningDashboard({ lessons, selectedId, filter, setFilter, onOpenBlock, onContinue, embedded, navOnly }: {
  lessons: Lesson[];
  selectedId: string | null;
  filter: StudyFilter;
  setFilter: (f: StudyFilter) => void;
  onOpenBlock: (block: LearningBlock) => void;
  onContinue: () => void;
  embedded?: boolean;
  navOnly?: boolean;
}) {
  const ov = overallPercent(lessons);
  const cont = firstIncomplete(lessons);
  const remaining = totalBlocks(lessons) - completedCount(lessons);
  const contLesson = cont ? lessons.find((l) => l.id === cont.lessonId) : null;
  const reviewCount = reviewList(lessons).length;

  // Активный урок = урок открытого блока, иначе первый незавершённый (для авто-раскрытия).
  const activeLessonId = useMemo(() => {
    if (selectedId) { const l = lessons.find((x) => x.learningBlocks.some((b) => b.id === selectedId)); if (l) return l.id; }
    return cont?.lessonId ?? lessons[0]?.id ?? null;
  }, [selectedId, lessons, cont]);

  // Аккордеон: раскрыт всегда только один урок; активный раскрывается автоматически.
  const [openId, setOpenId] = useState<string | null>(activeLessonId);
  const prevActive = useRef(activeLessonId);
  useEffect(() => {
    if (activeLessonId && activeLessonId !== prevActive.current) { prevActive.current = activeLessonId; setOpenId(activeLessonId); }
  }, [activeLessonId]);
  // Фильтры скрыты за кнопкой «Զտիչ», раскрываются по запросу (экономия вертикального места).
  const [filterOpen, setFilterOpen] = useState(false);

  return (
    <div className={`flex h-full min-h-0 flex-col ${embedded ? '' : 'rounded-lg border bg-card/20'}`}>
      {!embedded && (
        <div className="flex items-center gap-2 border-b px-3 py-2.5">
          <LayoutDashboard className="size-4 text-primary" />
          <span className="text-sm font-semibold">Ուսումնական վահանակ</span>
        </div>
      )}

      {/* Прогресс/Review-виджеты скрыты в navOnly (вкладка «Դասер» = только навигация) */}
      {!navOnly && (<>
      {cont && (
        <div className="m-1.5 rounded-lg border border-primary/30 bg-primary/5 p-2.5">
          <div className="text-[11px] font-medium uppercase tracking-wide text-primary">Շարունակել ուսումը</div>
          <div className="mt-1 line-clamp-1 text-xs text-muted-foreground">{contLesson?.title}</div>
          <div className="line-clamp-1 text-sm font-medium">{TYPE_META[cont.type].icon} {cont.title}</div>
          <div className="mt-0.5 text-[11px] text-muted-foreground">մնացել է բլոկ՝ {remaining}</div>
          <button onClick={onContinue} className="mt-2 flex w-full items-center justify-center gap-1.5 rounded-md bg-primary px-3 py-1.5 text-sm font-medium text-primary-foreground hover:opacity-90">
            <Play className="size-3.5 fill-current" /> Շարունակել
          </button>
        </div>
      )}

      <div className="mx-1.5 mb-1 rounded-lg border bg-card/40 p-2.5">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium">Ընդհանուր առաջընթաց</span>
          <span className="text-base font-bold tabular-nums text-primary">{ov}%</span>
        </div>
        <div className="mt-0.5 text-[11px] text-muted-foreground tabular-nums">{completedCount(lessons)} / {totalBlocks(lessons)} բլոկ · <Star className="inline size-3 fill-amber-400 text-amber-400" /> {favoritesCount(lessons)}</div>
        <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-secondary">
          <div className="h-full rounded-full bg-primary transition-all duration-500" style={{ width: `${ov}%` }} />
        </div>
      </div>

      {/* Needs Review */}
      <button onClick={() => setFilter(filter === 'review' ? 'all' : 'review')}
        className={`mx-1.5 mb-1 flex items-center gap-2 rounded-lg border px-2.5 py-2 text-left ${filter === 'review' ? 'border-amber-500/40 bg-amber-500/10' : 'bg-card/30 hover:bg-accent'}`}>
        <AlertCircle className="size-4 shrink-0 text-amber-400" />
        <span className="flex-1 text-sm font-medium">Կրկնության կարիք</span>
        <span className="rounded bg-amber-500/20 px-1.5 text-xs font-medium tabular-nums text-amber-400">{reviewCount}</span>
      </button>
      </>)}

      {/* Фильтры — за одной кнопкой (по умолчанию скрыты) */}
      <div className="mx-1.5 mb-1">
        <button onClick={() => setFilterOpen((o) => !o)}
          className={`flex w-full items-center gap-1.5 rounded px-2 py-1 text-[11px] transition ${filter !== 'all' ? 'bg-primary/10 text-primary' : 'bg-card/30 text-muted-foreground hover:text-foreground'}`}>
          <Filter className="size-3.5 shrink-0" />
          <span className="flex-1 text-left">Զտիչ{filter !== 'all' ? ` · ${FILTERS.find((f) => f.id === filter)?.label}` : ''}</span>
          <ChevronRight className={`size-3.5 shrink-0 transition-transform ${filterOpen ? 'rotate-90' : ''}`} />
        </button>
        {filterOpen && (
          <div className="mt-1 grid grid-cols-3 gap-1 text-[11px]">
            {FILTERS.map((f) => (
              <button key={f.id} onClick={() => { setFilter(f.id); setFilterOpen(false); }} className={`rounded px-1 py-1 transition ${filter === f.id ? 'bg-primary text-primary-foreground' : 'bg-card/30 text-muted-foreground hover:text-foreground'}`}>{f.label}</button>
            ))}
          </div>
        )}
      </div>

      <div className="min-h-0 flex-1 overflow-auto p-1.5 pt-0">
        {chapters(lessons).map((ch) => {
          const chDone = chapterComplete(ch);
          // под фильтром скрываем главы без совпадений
          const chHasMatch = filter === 'all' || ch.lessons.some((l) => l.learningBlocks.some((b) => matchFilter(b, filter)));
          if (!chHasMatch) return null;
          return (
            <div key={ch.chapter} className="mb-2">
              <div className="flex items-center justify-between px-2 py-1 text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
                <span className="flex items-center gap-1">{ch.chapter}{chDone && <CheckCircle2 className="size-3 text-primary" />}</span>
                <span className="tabular-nums">{ch.pct}%</span>
              </div>
              {ch.lessons.map((l) => {
                const hasMatch = filter === 'all' || l.learningBlocks.some((b) => matchFilter(b, filter));
                if (filter !== 'all' && !hasMatch) return null;
                // Аккордеон: в обычном режиме раскрыт только openId; под фильтром — все совпавшие.
                const isOpen = filter !== 'all' ? true : openId === l.id;
                const pct = lessonPercent(l);
                return (
                  <div key={l.id}>
                    {/* Компактная строка урока: стрелка · название · % (единственный индикатор) */}
                    <button
                      onClick={() => filter === 'all' && setOpenId((cur) => (cur === l.id ? null : l.id))}
                      disabled={filter !== 'all'}
                      className={`flex w-full items-center gap-1.5 rounded px-2 py-1 text-left hover:bg-accent disabled:hover:bg-transparent ${isOpen && filter === 'all' ? 'bg-accent/50' : ''}`}>
                      <ChevronRight className={`size-3.5 shrink-0 text-muted-foreground transition-transform ${isOpen ? 'rotate-90' : ''}`} />
                      <span className="line-clamp-1 flex-1 text-xs font-medium text-foreground">{l.title}</span>
                      <span className="shrink-0 text-[11px] font-medium tabular-nums text-muted-foreground">{pct}%</span>
                    </button>

                    {/* Раскрытие: задачи-категории — вторичные, с отступом (иерархия «урок → задачи») */}
                    {isOpen && (
                      <div className="mb-1 ml-3 space-y-px border-l pl-2">
                        {studyPlan(l).map((t) => {
                          const target = t.firstIncomplete ?? l.learningBlocks.find((b) => b.type === t.type) ?? null;
                          const complete = t.done === t.total;
                          const active = !!target && selectedId === target.id;
                          return (
                            <button key={t.type} onClick={() => target && onOpenBlock(target)}
                              className={`flex w-full items-center gap-1.5 rounded px-1.5 py-0.5 text-left text-[11px] ${active ? 'bg-accent text-foreground' : 'text-muted-foreground hover:bg-accent'}`}>
                              {complete ? <CheckCircle2 className="size-3 shrink-0 text-primary" /> : <Circle className="size-3 shrink-0 text-muted-foreground/40" />}
                              <span className="flex-1">{TYPE_META[t.type].label}</span>
                              {t.total > 1 && <span className="shrink-0 tabular-nums opacity-70">{t.done}/{t.total}</span>}
                            </button>
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          );
        })}
      </div>
    </div>
  );
}
