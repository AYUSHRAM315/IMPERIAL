import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import { getStoredItem, setStoredItem } from '@/utils/storage';
import { translations } from '@/i18n';

type Locale = 'en' | 'hi';

type TranslationKey = keyof typeof translations.en;

type LocaleContextValue = {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: (key: string, params?: Record<string, string | number>) => string;
};

const LocaleContext = createContext<LocaleContextValue | undefined>(undefined);

export function LocaleProvider({ children }: { children: ReactNode }) {
  const [locale, setLocale] = useState<Locale>('en');

  useEffect(() => {
    const stored = getStoredItem('locale');
    if (stored === 'hi' || stored === 'en') {
      setLocale(stored);
    }
  }, []);

  useEffect(() => {
    setStoredItem('locale', locale);
  }, [locale]);

  const value = useMemo<LocaleContextValue>(() => ({
    locale,
    setLocale,
    t(key, params) {
      const localeMap = translations[locale] as Record<string, string>;
      let text = localeMap[key] ?? translations.en[key as TranslationKey] ?? key;
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
