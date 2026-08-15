import { Link } from 'react-router-dom';
import { BookOpen } from 'lucide-react';
import { GRADES, TEXTBOOKS, SUBJECT_LABEL } from '../books/catalog';
import { useI18n } from '../i18n';

export function BooksPage() {
  const { t, locale } = useI18n();
  return (
    <div className="h-full overflow-auto px-4 pb-6 pt-3 md:px-6">
      <h1 className="mb-4 text-xl font-semibold">{t.navBooks}</h1>
      {GRADES.map((g) => (
        <section key={g} className="mb-7">
          <h2 className="mb-2.5 text-sm font-medium uppercase tracking-wide text-muted-foreground">
            {t.bookGrade} {g}
          </h2>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {TEXTBOOKS.filter((b) => b.grade === g).map((b) => (
              <Link
                key={b.id}
                to={`/app/books/${b.id}`}
                className="group flex gap-3 rounded-xl border bg-card p-4 transition-colors hover:bg-accent"
              >
                <div className="flex size-12 shrink-0 items-center justify-center rounded-lg bg-secondary text-secondary-foreground">
                  <BookOpen className="size-6" />
                </div>
                <div className="min-w-0">
                  <div className="truncate font-medium">{b.title[locale]}</div>
                  <div className="truncate text-xs text-muted-foreground">{SUBJECT_LABEL[b.subject][locale]}</div>
                  <div className="mt-1 text-xs text-muted-foreground/80">
                    {[b.author, b.year, b.pages && `${b.pages}`].filter(Boolean).join(' · ')}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}
