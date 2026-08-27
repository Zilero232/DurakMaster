import { Text, View } from 'react-native';

import { iconSize } from '@/ui-kit';

import type { SummaryTileProps } from './SummaryTile.types';

import { styles } from './SummaryTile.styles';

export const SummaryTile = ({ icon: Icon, tint, value, label }: SummaryTileProps) => (
  <View style={styles.root}>
    <Icon color={tint} size={iconSize.md} />

    <Text numberOfLines={1} style={styles.value}>
      {value}
    </Text>

    <Text numberOfLines={2} style={styles.label}>
      {label}
    </Text>
  </View>
);
