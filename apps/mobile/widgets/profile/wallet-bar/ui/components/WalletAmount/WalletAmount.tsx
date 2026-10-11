import { View } from 'react-native';

import { iconSize } from '@/ui-kit';

import type { WalletAmountProps } from './WalletAmount.types';

import { AnimatedNumber } from '../AnimatedNumber';
import { styles } from './WalletAmount.styles';

export const WalletAmount = ({ icon: Icon, iconColor, value }: WalletAmountProps) => (
  <View style={styles.root}>
    <Icon color={iconColor} size={iconSize.md} />

    <AnimatedNumber style={styles.amount} value={value} />
  </View>
);
