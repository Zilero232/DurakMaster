import { useTranslation } from 'react-i18next';

import type { UseLocaleResult } from './use-locale.types';

import { resolveLocale } from '../../lib';
import { changeLocale } from '../i18n';

export const useLocale = (): UseLocaleResult => {
  const { i18n } = useTranslation();

  return {
    locale: resolveLocale(i18n.language),

    setLocale: (locale) => {
      void changeLocale(locale);
    }
  };
};
