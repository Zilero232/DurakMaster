import { getLocales } from 'expo-localization';

import type { Locale } from '../config';

import { DEFAULT_LOCALE } from '../config';
import { isLocale } from './resolve-locale';

export const detectLocale = (): Locale => {
  for (const { languageCode } of getLocales()) {
    const code = languageCode?.slice(0, 2).toLowerCase();

    if (code && isLocale(code)) {
      return code;
    }
  }

  return DEFAULT_LOCALE;
};
