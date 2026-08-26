import { getLocales } from 'expo-localization';

export const LOCALES = ['ru', 'en'] as const;

export type Locale = (typeof LOCALES)[number];

export const DEFAULT_LOCALE: Locale = 'ru';

export const LOCALE_LABELS: Record<Locale, string> = {
  ru: 'Русский',
  en: 'English'
};

export const LOCALE_STORAGE_KEY = 'durak-master.locale';

const isLocale = (value: string): value is Locale => LOCALES.includes(value as Locale);

export const resolveLocale = (value: string | null | undefined): Locale => {
  const code = value?.slice(0, 2).toLowerCase();

  return code && isLocale(code) ? code : DEFAULT_LOCALE;
};

export const detectLocale = (): Locale => {
  for (const { languageCode } of getLocales()) {
    const code = languageCode?.slice(0, 2).toLowerCase();

    if (code && isLocale(code)) {
      return code;
    }
  }

  return DEFAULT_LOCALE;
};
