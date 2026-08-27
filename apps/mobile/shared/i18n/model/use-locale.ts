import { useTranslation } from 'react-i18next';

import type { Locale } from '../config';

import { resolveLocale } from '../lib';
import { changeLocale } from './i18n';

type UseLocaleOutput = {
  locale: Locale;
  setLocale: (locale: Locale) => void;
};

export const useLocale = (): UseLocaleOutput => {
  const { i18n } = useTranslation();

  return {
    locale: resolveLocale(i18n.language),

    setLocale: (locale) => {
      void changeLocale(locale);
    }
  };
};
