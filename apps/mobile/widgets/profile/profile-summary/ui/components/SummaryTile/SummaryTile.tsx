import { Text } from 'react-native';

import { iconSize, Panel } from '@/ui-kit';

import type { SummaryTileProps } from './SummaryTile.types';

import { styles } from './SummaryTile.styles';

export const SummaryTile = ({ icon: Icon, tint, value, label }: SummaryTileProps) => (
  <Panel elevation='flat' padding='compact' style={styles.root} tone='sunken'>
    <Icon color={tint} size={iconSize.md} />

    <Text numberOfLines={1} style={styles.value}>
      {value}
    </Text>

    <Text numberOfLines={2} style={styles.label}>
      {label}
    </Text>
  </Panel>
);
