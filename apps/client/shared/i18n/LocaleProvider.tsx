'use client';

import { NextIntlClientProvider } from 'next-intl';
import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';

import { DEFAULT_LOCALE, LOCALE_STORAGE_KEY, resolveLocale } from './config';
import { messages } from './messages';

import type { Locale } from './config';

type LocaleProviderProps = {
  children: React.ReactNode;
};

type LocaleContextValue = {
  locale: Locale;
  setLocale: (locale: Locale) => void;
};

const LocaleContext = createContext<LocaleContextValue>({
  locale: DEFAULT_LOCALE,
  setLocale: () => undefined,
});

/** Текущий язык и его смена. Выбор сохраняется между запусками. */
export const useLocale = () => useContext(LocaleContext);

/**
 * Локаль на клиенте.
 *
 * Приложение собирается статически (`output: 'export'`) и живёт в том числе
 * внутри Tauri, где сервера нет вовсе — определить язык по заголовкам
 * запроса невозможно. Поэтому язык берётся из сохранённого выбора, а при
 * его отсутствии из настроек системы.
 *
 * Первый кадр всегда рендерится на языке по умолчанию: серверная разметка
 * не знает про localStorage, и расхождение сломало бы гидратацию.
 */
export const LocaleProvider = ({ children }: LocaleProviderProps) => {
  const [locale, setLocaleState] = useState<Locale>(DEFAULT_LOCALE);

  useEffect(() => {
    const stored = window.localStorage.getItem(LOCALE_STORAGE_KEY);
    const next = resolveLocale(stored ?? window.navigator.language.split('-')[0]);

    if (next !== DEFAULT_LOCALE) {
      setLocaleState(next);
    }
  }, []);

  useEffect(() => {
    document.documentElement.lang = locale;
  }, [locale]);

  const setLocale = useCallback((next: Locale) => {
    setLocaleState(next);
    window.localStorage.setItem(LOCALE_STORAGE_KEY, next);
  }, []);

  const value = useMemo(() => ({ locale, setLocale }), [locale, setLocale]);

  return (
    <LocaleContext.Provider value={value}>
      <NextIntlClientProvider locale={locale} messages={messages[locale]} timeZone="Europe/Moscow">
        {children}
      </NextIntlClientProvider>
    </LocaleContext.Provider>
  );
};
