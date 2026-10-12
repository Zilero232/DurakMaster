import { View } from 'react-native';

import { DiscardStack, TableField, TalonStack, useTableCenter } from '@/entities/game-table';

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

  const center = useTableCenter({ slots: view.table.length + (canTransfer ? 1 : 0) });

  return (
    <View style={styles.root}>
      <View style={[styles.row, { gap: center.gap }]} onLayout={center.onLayout}>
        {center.isMeasured && (
          <>
            <View style={{ width: center.talon }}>
              {view.phase === 'playing' && (
                <TalonStack
                  cardWidth={center.card}
                  count={view.talonCount}
                  trump={view.trump}
                  trumpCard={view.trumpCard}
                />
              )}
            </View>

            <TableField
              beatableIndexes={beatableIndexes}
              canTransfer={canTransfer}
              cardWidth={center.card}
              fieldWidth={center.field}
              hoveredIndex={hoveredIndex}
              isInstant={isInstant}
              isWaiting={view.phase !== 'playing'}
              mySeat={mySeat}
              pairs={view.table}
              onDefend={onDefend}
              onTransfer={onTransfer}
              onZonesChange={drag.onZonesChange}
            />

            <View style={[styles.discard, { width: center.discard }]}>
              <DiscardStack cardWidth={center.card} count={view.discardCount} />
            </View>
          </>
        )}
      </View>
    </View>
  );
};
