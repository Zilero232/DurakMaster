import { Text, View } from 'react-native';

import type { CountBadgeProps } from './CountBadge.types';

import { styles } from './CountBadge.styles';

export const CountBadge = ({ count, tone = 'danger', max = 99 }: CountBadgeProps) => {
  if (count <= 0) {
    return null;
  }

  const isGold = tone === 'gold';

  return (
    <View style={[styles.root, isGold ? styles.gold : styles.danger]}>
      <Text style={[styles.count, isGold ? styles.countOnGold : styles.countOnDanger]}>
        {count > max ? `${max}+` : count}
      </Text>
    </View>
  );
};
