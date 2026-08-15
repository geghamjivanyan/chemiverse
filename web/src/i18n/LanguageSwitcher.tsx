import { useI18n } from './index';
import { LANGUAGES } from './locales';
import { cn } from '@/lib/utils';

export function LanguageSwitcher() {
  const { locale, setLocale, t } = useI18n();
  return (
    <div className="inline-flex rounded-md bg-secondary p-0.5" role="group" aria-label={t.language}>
      {LANGUAGES.map((l) => (
        <button
          key={l.code}
          type="button"
          aria-pressed={locale === l.code}
          onClick={() => setLocale(l.code)}
          className={cn(
            'rounded px-2 py-1 text-xs font-medium transition-colors',
            locale === l.code ? 'bg-background text-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground',
          )}
        >
          {l.label}
        </button>
      ))}
    </div>
  );
}
