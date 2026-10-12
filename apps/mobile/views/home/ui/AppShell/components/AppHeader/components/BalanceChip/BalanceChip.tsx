import { Text, View } from 'react-native';

import { formatCredits } from '@/shared/lib/format';
import { iconSize } from '@/ui-kit';

import type { BalanceChipProps } from './BalanceChip.types';

import { styles } from './BalanceChip.styles';

export const BalanceChip = ({ icon: Icon, tint, value, accessibilityLabel }: BalanceChipProps) => (
  <View accessible accessibilityLabel={accessibilityLabel} style={styles.root}>
    <Icon color={tint} size={iconSize.sm} />

    <Text numberOfLines={1} style={styles.value}>
      {formatCredits(value)}
    </Text>
  </View>
);
