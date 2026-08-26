import type { Locale } from '../config';

import { DEFAULT_LOCALE, LOCALES } from '../config';

export const isLocale = (value: string): value is Locale => LOCALES.includes(value as Locale);

export const resolveLocale = (value: string | null | undefined): Locale => {
  const code = value?.slice(0, 2).toLowerCase();

  return code && isLocale(code) ? code : DEFAULT_LOCALE;
};
