import { Plus } from 'lucide-react-native';
import { Pressable, View } from 'react-native';

import { colors, iconSize } from '@/ui-kit';

import type { WalletAmountProps } from './WalletAmount.types';

import { AnimatedNumber } from '../AnimatedNumber';
import { styles } from './WalletAmount.styles';

export const WalletAmount = ({
  icon: Icon,
  iconColor,
  value,
  topUpLabel,
  onTopUp
}: WalletAmountProps) => (
  <View style={styles.root}>
    <Icon color={iconColor} size={iconSize.md} />

    <AnimatedNumber style={styles.amount} value={value} />

    <Pressable
      accessibilityLabel={topUpLabel}
      accessibilityRole='button'
      hitSlop={8}
      style={({ pressed }) => [styles.topUp, pressed && styles.pressed]}
      onPress={onTopUp}
    >
      <Plus color={colors.accent} size={iconSize.sm} />
    </Pressable>
  </View>
);
