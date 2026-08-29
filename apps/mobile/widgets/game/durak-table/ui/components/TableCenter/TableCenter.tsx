import { View } from 'react-native';

import { DiscardStack, TableField, TalonStack } from '@/entities/game-table';

import type { TableCenterProps } from './TableCenter.types';

import { useTableContext } from '../../../model';
import { styles } from './TableCenter.styles';

export const TableCenter = ({
  view,
  beatableIndexes,
  cardScale,
  mySeat,
  isInstant,
  hoveredIndex,
  onDefend
}: TableCenterProps) => {
  const { drag } = useTableContext();

  return (
    <View style={styles.root}>
      <TalonStack count={view.talonCount} trump={view.trump} trumpCard={view.trumpCard} />

      <TableField
        beatableIndexes={beatableIndexes}
        cardScale={cardScale}
        hoveredIndex={hoveredIndex}
        isInstant={isInstant}
        mySeat={mySeat}
        pairs={view.table}
        onDefend={onDefend}
        onZonesChange={drag.onZonesChange}
      />

      <View style={styles.discard}>
        <DiscardStack count={view.discardCount} />
      </View>
    </View>
  );
};
