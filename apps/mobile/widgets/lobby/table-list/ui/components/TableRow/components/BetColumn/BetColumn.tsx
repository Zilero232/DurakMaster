import { Text, View } from 'react-native';

import { formatCredits } from '@/shared/lib/format';

import type { BetColumnProps } from './BetColumn.types';

import { styles } from './BetColumn.styles';

export const BetColumn = ({ bet, seats, taken }: BetColumnProps) => (
  <View style={styles.root}>
    <Text numberOfLines={1} style={styles.bet}>
      {formatCredits(bet)}
    </Text>

    <View style={styles.seats}>
      {Array.from({ length: seats }, (_, seat) => (
        <View key={seat} style={[styles.seat, seat < taken && styles.taken]} />
      ))}
    </View>
  </View>
);
