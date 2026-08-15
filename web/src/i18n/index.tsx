import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import type { ReactNode } from 'react';
import type { Locale } from '@chemverse/shared';
import { dictionaries, type Dict } from './locales';

const STORAGE_KEY = 'chemverse.locale';
const SUPPORTED: Locale[] = ['en', 'hy', 'ru'];

function detectInitial(): Locale {
  try {
    const saved = localStorage.getItem(STORAGE_KEY) as Locale | null;
    if (saved && SUPPORTED.includes(saved)) return saved;
  } catch {
    /* localStorage недоступен — игнорируем */
  }
  const nav = (navigator.language || 'en').slice(0, 2).toLowerCase();
  return (SUPPORTED as string[]).includes(nav) ? (nav as Locale) : 'en';
}

interface I18nValue {
  locale: Locale;
  setLocale: (l: Locale) => void;
  t: Dict;
}

const I18nContext = createContext<I18nValue | null>(null);

export function I18nProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>(detectInitial);

  useEffect(() => {
    document.documentElement.lang = locale;
  }, [locale]);

  const value = useMemo<I18nValue>(
    () => ({
      locale,
      setLocale: (l) => {
        setLocaleState(l);
        try {
          localStorage.setItem(STORAGE_KEY, l);
        } catch {
          /* игнорируем */
        }
      },
      t: dictionaries[locale],
    }),
    [locale],
  );

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n(): I18nValue {
  const ctx = useContext(I18nContext);
  if (!ctx) throw new Error('useI18n должен использоваться внутри <I18nProvider>');
  return ctx;
}
