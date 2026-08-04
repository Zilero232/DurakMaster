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

export const resolveLocale = (value: string | undefined | null): Locale => {
  const code = value?.slice(0, 2).toLowerCase();

  return LOCALES.includes(code as Locale) ? (code as Locale) : DEFAULT_LOCALE;
};

/**
 * Язык из настроек браузера.
 *
 * Смотрим весь список `navigator.languages`, а не только первый элемент:
 * у русскоязычных пользователей первым часто стоит `en-US` из системы,
 * а русский идёт следом — по одному первому языку игра ушла бы в английский.
 */
export const detectLocale = (): Locale => {
  const languages = typeof navigator === 'undefined' ? [] : navigator.languages;

  for (const language of languages) {
    const code = language.slice(0, 2).toLowerCase();

    if (LOCALES.includes(code as Locale)) {
      return code as Locale;
    }
  }

  return DEFAULT_LOCALE;
};
