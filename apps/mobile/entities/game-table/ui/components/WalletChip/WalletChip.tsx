import { Coins, Wallet } from 'lucide-react-native';
import { Text, View } from 'react-native';

import { formatCredits } from '@/shared/lib/format';
import { colors, iconSize } from '@/ui-kit';

import type { WalletChipProps } from './WalletChip.types';

import { styles } from './WalletChip.styles';

export const WalletChip = ({ credits, coins }: WalletChipProps) => (
  <View style={styles.root}>
    <View style={styles.amount}>
      <Wallet color={colors.success} size={iconSize.xs} />

      <Text style={styles.value}>{formatCredits(credits)}</Text>
    </View>

    <View style={styles.divider} />

    <View style={styles.amount}>
      <Coins color={colors.gold} size={iconSize.xs} />

      <Text style={styles.value}>{coins}</Text>
    </View>
  </View>
);
