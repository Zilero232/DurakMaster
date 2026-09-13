import type { Locale } from '../../config';

export type UseLocaleResult = {
  locale: Locale;
  setLocale: (locale: Locale) => void;
};
