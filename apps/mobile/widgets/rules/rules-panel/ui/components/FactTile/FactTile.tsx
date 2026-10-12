import { Text, View } from 'react-native';

import { colors, iconSize } from '@/ui-kit';

import type { FactTileProps } from './FactTile.types';

import { styles } from './FactTile.styles';

export const FactTile = ({ icon: Icon, value, label }: FactTileProps) => (
  <View style={styles.root}>
    <Icon color={colors.accent} size={iconSize.md} />

    <Text numberOfLines={1} style={styles.value}>
      {value}
    </Text>

    <Text numberOfLines={2} style={styles.label}>
      {label}
    </Text>
  </View>
);
