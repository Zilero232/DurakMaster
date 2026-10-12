import { Globe } from 'lucide-react-native';
import { useTranslation } from 'react-i18next';
import { Pressable, Text } from 'react-native';

import { colors, iconSize } from '@/ui-kit';

import { LOCALE_LABELS, LOCALES } from '../../config';
import { useLocale } from '../../model';
import { styles } from './LanguageSwitch.styles';

export const LanguageSwitch = () => {
  const { t } = useTranslation();

  const { locale, setLocale } = useLocale();

  const nextLocale = LOCALES[(LOCALES.indexOf(locale) + 1) % LOCALES.length];

  return (
    <Pressable
      accessibilityLabel={t('settings.language')}
      accessibilityRole='button'
      accessibilityValue={{ text: LOCALE_LABELS[locale] }}
      style={({ pressed }) => [styles.root, pressed && styles.pressed]}
      onPress={() => setLocale(nextLocale)}
    >
      <Globe color={colors.onFeltMuted} size={iconSize.sm} />

      <Text style={styles.code}>{locale.toUpperCase()}</Text>
    </Pressable>
  );
};
