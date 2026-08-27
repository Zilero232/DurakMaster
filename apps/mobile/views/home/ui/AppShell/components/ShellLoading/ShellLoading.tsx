import { LinearGradient } from 'expo-linear-gradient';
import { useTranslation } from 'react-i18next';
import { Text, View } from 'react-native';

import { colors, iconSize, screenGradient, Spinner, SuitIcon } from '@/ui-kit';

import { styles } from './ShellLoading.styles';

export const ShellLoading = () => {
  const { t } = useTranslation();

  return (
    <View style={styles.root}>
      <LinearGradient colors={screenGradient} style={styles.wash} />

      <SuitIcon color={colors.accent} size={iconSize.hero} suit='spades' />

      <Spinner size={iconSize.lg} />

      <Text style={styles.label}>{t('common.loading')}</Text>
    </View>
  );
};
