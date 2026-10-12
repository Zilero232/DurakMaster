import { View } from 'react-native';

import { DiscardStack, TableField, TalonStack } from '@/entities/game-table';

import type { TableCenterProps } from './TableCenter.types';

import { useTableContext } from '../../../model';
import { styles } from './TableCenter.styles';

export const TableCenter = ({
  view,
  beatableIndexes,
  mySeat,
  isInstant,
  canTransfer,
  hoveredIndex,
  onDefend,
  onTransfer
}: TableCenterProps) => {
  const { drag } = useTableContext();

  return (
    <View style={styles.root}>
      <View style={styles.talon}>
        {view.phase === 'playing' && (
          <TalonStack count={view.talonCount} trump={view.trump} trumpCard={view.trumpCard} />
        )}
      </View>

      <View style={styles.field}>
        <TableField
          beatableIndexes={beatableIndexes}
          canTransfer={canTransfer}
          hoveredIndex={hoveredIndex}
          isInstant={isInstant}
          isWaiting={view.phase !== 'playing'}
          mySeat={mySeat}
          pairs={view.table}
          onDefend={onDefend}
          onTransfer={onTransfer}
          onZonesChange={drag.onZonesChange}
        />
      </View>

      <View style={styles.discard}>
        <DiscardStack count={view.discardCount} />
      </View>
    </View>
  );
};
