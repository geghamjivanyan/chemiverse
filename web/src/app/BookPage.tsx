import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { byId, SUBJECT_LABEL } from '../books/catalog';
import { BookViewer } from '../books/BookViewer';
import { FlipBook } from '../books/FlipBook';
import { Reader2 } from '../books2/Reader2';
import { READER2_CONFIGS } from '../books2/store';
import { GoldenLessonReader } from '../golden/GoldenLessonReader';
import { GOLDEN_LESSONS } from '../golden/lessons';
import { WEB_BOOK } from '../books/html';
import { useI18n } from '../i18n';

export function BookPage() {
  const { id } = useParams<{ id: string }>();
  const { t, locale } = useI18n();
  const navigate = useNavigate();
  const book = id ? byId(id) : null;

  if (!book) return <div className="grid h-full place-items-center text-muted-foreground">—</div>;

  return (
    <div className="flex h-full flex-col pb-4 pl-2 pr-4 pt-3 md:pl-3 md:pr-6">
      <div className="mb-2 flex items-center gap-3">
        <Button variant="ghost" size="sm" className="-ml-2" onClick={() => navigate('/app/books')}>
          <ArrowLeft className="size-4" /> {t.back}
        </Button>
        <div className="min-w-0">
          <span className="font-medium">{book.title[locale]}</span>
          <span className="ml-2 text-sm text-muted-foreground">{SUBJECT_LABEL[book.subject][locale]} · {t.bookGrade} {book.grade}</span>
        </div>
      </div>
      <div className="min-h-0 flex-1">
        {GOLDEN_LESSONS[book.id] ? (
          <GoldenLessonReader lesson={GOLDEN_LESSONS[book.id]!} onNextLesson={() => navigate('/app/books')} />
        ) : READER2_CONFIGS[book.id] && WEB_BOOK[book.id] ? (
          <Reader2 id={book.id} book={WEB_BOOK[book.id]!} title={book.title[locale]} />
        ) : WEB_BOOK[book.id] ? (
          <FlipBook id={book.id} book={WEB_BOOK[book.id]!} title={book.title[locale]} />
        ) : (
          <BookViewer file={book.file} />
        )}
      </div>
    </div>
  );
}
