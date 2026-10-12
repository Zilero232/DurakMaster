import { useTranslation } from 'react-i18next';
import { Text, View } from 'react-native';

import { cardKey } from '@/shared/lib/cards';
import { card } from '@/ui-kit';

import type { TableFieldProps } from './TableField.types';

import { CENTER_GAP, useDropZones } from '../../../model';
import { PairSlot, TransferSlot } from './components';
import { styles } from './TableField.styles';

export const TableField = ({
  cardWidth,
  fieldWidth,
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

  const width = cardWidth;
  const height = cardWidth / card.ratio;
  const rootStyle = [styles.root, { width: fieldWidth, gap: CENTER_GAP }];

  const { onMeasure } = useDropZones({ slotCount, onChange: onZonesChange });

  if (pairs.length === 0) {
    return (
      <View style={rootStyle}>
        {isWaiting && <Text style={styles.empty}>{t('table.waitingTitle')}</Text>}
      </View>
    );
  }

  return (
    <View style={rootStyle}>
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
