import { useTranslation } from 'react-i18next';
import { Pressable, Text } from 'react-native';

import type { LanguageSwitchProps } from './LanguageSwitch.types';

import { LOCALE_LABELS, LOCALES } from '../../config';
import { useLocale } from '../../model';
import { styles } from './LanguageSwitch.styles';

export const LanguageSwitch = ({ isSquared = false }: LanguageSwitchProps) => {
  const { t } = useTranslation();

  const { locale, setLocale } = useLocale();

  const nextLocale = LOCALES[(LOCALES.indexOf(locale) + 1) % LOCALES.length];

  return (
    <Pressable
      accessibilityLabel={t('settings.language')}
      accessibilityRole='button'
      accessibilityValue={{ text: LOCALE_LABELS[locale] }}
      hitSlop={8}
      style={[styles.root, isSquared && styles.squared]}
      onPress={() => setLocale(nextLocale)}
    >
      <Text style={styles.code}>{locale.toUpperCase()}</Text>
    </Pressable>
  );
};
