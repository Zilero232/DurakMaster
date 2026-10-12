import { UserRound } from 'lucide-react-native';
import { useTranslation } from 'react-i18next';
import { Text, View } from 'react-native';

import { LOCALE_LABELS, LOCALES, useLocale } from '@/shared/i18n';
import { SegmentedControl, SettingsSection } from '@/ui-kit';

import type { AccountSectionProps } from './AccountSection.types';

import { styles } from './AccountSection.styles';

export const AccountSection = ({ signOutButton }: AccountSectionProps) => {
  const { t } = useTranslation();

  const { locale, setLocale } = useLocale();

  const languageOptions = LOCALES.map((value) => ({ value, label: LOCALE_LABELS[value] }));

  return (
    <SettingsSection icon={UserRound} title={t('settings.account')}>
      <View style={styles.language}>
        <Text style={styles.label}>{t('settings.language')}</Text>

        <SegmentedControl
          accessibilityLabel={t('settings.language')}
          options={languageOptions}
          value={locale}
          onChange={setLocale}
        />
      </View>

      <View style={styles.signOut}>{signOutButton}</View>
    </SettingsSection>
  );
};
