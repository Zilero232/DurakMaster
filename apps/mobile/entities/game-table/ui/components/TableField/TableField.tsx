import { useTranslation } from 'react-i18next';
import { Text, View } from 'react-native';

import { cardKey } from '@/shared/lib/cards';

import type { TableFieldProps } from './TableField.types';

import { useCardSize, useDropZones } from '../../../model';
import { PairSlot, TransferSlot } from './components';
import { styles } from './TableField.styles';

export const TableField = ({
  pairs,
  beatableIndexes,
  mySeat,
  isWaiting = false,
  canTransfer = false,
  hoveredIndex = null,
  isInstant = false,
  onDefend,
  onTransfer,
  onZonesChange
}: TableFieldProps) => {
  const { t } = useTranslation();

  const { width, height } = useCardSize();

  const transferIndex = pairs.length;

  const { onMeasure } = useDropZones({
    slotCount: canTransfer ? transferIndex + 1 : transferIndex,
    onChange: onZonesChange
  });

  if (pairs.length === 0) {
    return (
      <View style={styles.root}>
        <Text style={styles.empty}>
          {t(isWaiting ? 'table.waitingTitle' : 'table.attackerTurn')}
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.root}>
      {pairs.map((pair, index) => (
        <PairSlot
          key={cardKey(pair.attack)}
          canBeat={beatableIndexes.has(index)}
          height={height}
          index={index}
          isHovered={hoveredIndex === index}
          isInstant={isInstant}
          mySeat={mySeat}
          pair={pair}
          width={width}
          onDefend={onDefend}
          onMeasure={onMeasure}
        />
      ))}

      {canTransfer && onTransfer && (
        <TransferSlot
          height={height}
          index={transferIndex}
          isHovered={hoveredIndex === transferIndex}
          width={width}
          onMeasure={onMeasure}
          onPress={onTransfer}
        />
      )}
    </View>
  );
};
