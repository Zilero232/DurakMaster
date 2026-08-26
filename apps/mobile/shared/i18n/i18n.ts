import AsyncStorage from '@react-native-async-storage/async-storage';
import i18next from 'i18next';
import { initReactI18next } from 'react-i18next';

import type { Locale } from './config';

import { DEFAULT_LOCALE, detectLocale, LOCALE_STORAGE_KEY, resolveLocale } from './config';
import en from './locales/en.json';
import ru from './locales/ru.json';

export const resources = {
  ru: { translation: ru },
  en: { translation: en }
} as const;

void i18next.use(initReactI18next).init({
  resources,
  lng: DEFAULT_LOCALE,
  fallbackLng: DEFAULT_LOCALE,

  interpolation: {
    escapeValue: false
  },

  returnEmptyString: false
});

export const restoreLocale = async (): Promise<Locale> => {
  const stored = await AsyncStorage.getItem(LOCALE_STORAGE_KEY).catch(() => null);
  const locale = stored ? resolveLocale(stored) : detectLocale();

  if (locale !== i18next.language) {
    await i18next.changeLanguage(locale);
  }

  return locale;
};

export const changeLocale = async (locale: Locale): Promise<void> => {
  await i18next.changeLanguage(locale);
  await AsyncStorage.setItem(LOCALE_STORAGE_KEY, locale).catch(() => {});
};

export { i18next };
