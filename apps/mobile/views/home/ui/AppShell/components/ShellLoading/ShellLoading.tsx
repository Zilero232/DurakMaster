import { useTranslation } from 'react-i18next';
import { Text } from 'react-native';

import { colors, iconSize, LobbyBackground, Spinner, SuitIcon } from '@/ui-kit';

import { styles } from './ShellLoading.styles';

export const ShellLoading = () => {
  const { t } = useTranslation();

  return (
    <LobbyBackground style={styles.root}>
      <SuitIcon color={colors.accent} size={iconSize.hero} suit='spades' />

      <Spinner size={iconSize.lg} />

      <Text style={styles.label}>{t('common.loading')}</Text>
    </LobbyBackground>
  );
};
