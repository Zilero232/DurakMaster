import { View } from 'react-native';

import { TableField, TalonStack } from '@/entities/game-table';

import type { TableCenterProps } from './TableCenter.types';

import { styles } from './TableCenter.styles';

export const TableCenter = ({
  view,
  beatableIndexes,
  hoveredIndex,
  cardScale,
  isInstant,
  onDefend,
  onZonesChange
}: TableCenterProps) => (
  <View style={styles.root}>
    <TalonStack count={view.talonCount} trump={view.trump} trumpCard={view.trumpCard} />

    <TableField
      beatableIndexes={beatableIndexes}
      cardScale={cardScale}
      hoveredIndex={hoveredIndex}
      isInstant={isInstant}
      pairs={view.table}
      onDefend={onDefend}
      onZonesChange={onZonesChange}
    />
  </View>
);
