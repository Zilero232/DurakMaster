export { DEFAULT_LOCALE, LOCALE_LABELS, LOCALE_STORAGE_KEY, LOCALES } from './config';
export type { Locale } from './config';

export { detectLocale, isLocale, resolveLocale } from './lib';

export { changeLocale, i18next, restoreLocale, useLocale } from './model';
export { LanguageSwitch } from './ui';
