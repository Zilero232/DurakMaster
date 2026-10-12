import { useTranslation } from 'react-i18next';
import { Text, View } from 'react-native';

import { cardKey } from '@/shared/lib/cards';

import type { TableFieldProps } from './TableField.types';

import { useDropZones, useFieldCard } from '../../../model';
import { PairSlot, TransferSlot } from './components';
import { FIELD_GAP, styles } from './TableField.styles';

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

  const transferIndex = pairs.length;
  const slotCount = canTransfer ? transferIndex + 1 : transferIndex;

  const { width, height, onLayout } = useFieldCard({ slots: slotCount, gap: FIELD_GAP });

  const { onMeasure } = useDropZones({ slotCount, onChange: onZonesChange });

  if (pairs.length === 0) {
    return (
      <View style={styles.root} onLayout={onLayout}>
        <Text style={styles.empty}>
          {t(isWaiting ? 'table.waitingTitle' : 'table.attackerTurn')}
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.root} onLayout={onLayout}>
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
