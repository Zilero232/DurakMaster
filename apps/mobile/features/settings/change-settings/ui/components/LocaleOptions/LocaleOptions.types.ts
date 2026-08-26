import type { Locale } from '@/shared/i18n';

export type LocaleOptionsProps = {
  value: Locale;
  onChange: (locale: Locale) => void;
};
