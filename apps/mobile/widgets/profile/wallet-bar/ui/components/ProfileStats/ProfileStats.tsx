import { useTranslation } from 'react-i18next';
import { Text, View } from 'react-native';

import type { ProfileStatsProps } from './ProfileStats.types';

import { AnimatedNumber } from '../AnimatedNumber';
import { styles } from './ProfileStats.styles';

export const ProfileStats = ({ rating, gamesPlayed, winRate }: ProfileStatsProps) => {
  const { t } = useTranslation();

  const items = [
    { id: 'rating', label: t('profile.rating'), value: rating },
    { id: 'games', label: t('profile.games', { count: gamesPlayed }), value: gamesPlayed },
    { id: 'wins', label: t('profile.wins'), value: winRate, suffix: '%' }
  ];

  return (
    <View style={styles.root}>
      {items.map(({ id, label, value, suffix }) => (
        <View key={id} style={styles.stat}>
          <Text numberOfLines={1} style={styles.label}>
            {label}
          </Text>

          <AnimatedNumber style={styles.value} suffix={suffix} value={value} />
        </View>
      ))}
    </View>
  );
};
