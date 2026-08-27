import type { ru } from './shared/i18n/locales';

declare module 'i18next' {
  type CustomTypeOptions = {
    defaultNS: 'translation';
    resources: {
      translation: typeof ru;
    };
  };
}
