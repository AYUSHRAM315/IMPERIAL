import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import { translations } from '@/i18n';

type Locale = 'en' | 'hi';

type TranslationKey = keyof typeof translations.en;

type LocaleContextValue = {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: (key: TranslationKey, params?: Record<string, string | number>) => string;
};

const LocaleContext = createContext<LocaleContextValue | undefined>(undefined);

export function LocaleProvider({ children }: { children: ReactNode }) {
  const [locale, setLocale] = useState<Locale>('en');

  useEffect(() => {
    const stored = localStorage.getItem('locale');
    if (stored === 'hi' || stored === 'en') {
      setLocale(stored);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('locale', locale);
  }, [locale]);

  const value = useMemo<LocaleContextValue>(() => ({
    locale,
    setLocale,
    t(key, params) {
      let text = translations[locale][key] ?? translations.en[key] ?? key;
      if (params) {
        Object.entries(params).forEach(([paramKey, paramValue]) => {
          text = text.replace(`{${paramKey}}`, String(paramValue));
        });
      }
      return text;
    },
  }), [locale]);

  return <LocaleContext.Provider value={value}>{children}</LocaleContext.Provider>;
}

export function useLocale() {
  const context = useContext(LocaleContext);
  if (!context) throw new Error('useLocale must be used within LocaleProvider');
  return context;
}
