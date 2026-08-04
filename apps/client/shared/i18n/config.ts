export const LOCALES = ['ru', 'en'] as const;

export type Locale = (typeof LOCALES)[number];

/** Русский по умолчанию: основная аудитория игры — русскоязычная. */
export const DEFAULT_LOCALE: Locale = 'ru';

export const LOCALE_LABELS: Record<Locale, string> = {
  ru: 'Русский',
  en: 'English',
};

/** Ключ выбранного языка. Выбор переживает перезапуск приложения. */
export const LOCALE_STORAGE_KEY = 'durak-master.locale';

export const resolveLocale = (value: string | undefined): Locale =>
  LOCALES.includes(value as Locale) ? (value as Locale) : DEFAULT_LOCALE;
