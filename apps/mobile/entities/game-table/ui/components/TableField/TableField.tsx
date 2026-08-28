import { useCallback, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { Text, View } from 'react-native';

import { cardKey } from '@/shared/lib/cards';

import type { DropZone } from '../../../model';
import type { TableFieldProps } from './TableField.types';

import { useCardSize } from '../../../model';
import { PairSlot } from './components';
import { styles } from './TableField.styles';

export const TableField = ({
  pairs,
  beatableIndexes,
  mySeat,
  hoveredIndex = null,
  cardScale = 'normal',
  isInstant = false,
  onDefend,
  onZonesChange
}: TableFieldProps) => {
  const { t } = useTranslation();

  const { width, height } = useCardSize(cardScale);

  const zonesRef = useRef<Map<number, DropZone>>(new Map());

  useEffect(() => {
    for (const index of zonesRef.current.keys()) {
      if (index >= pairs.length) {
        zonesRef.current.delete(index);
      }
    }

    onZonesChange?.([...zonesRef.current.values()]);
  }, [pairs.length, onZonesChange]);

  const handleMeasure = useCallback(
    (zone: DropZone) => {
      const previous = zonesRef.current.get(zone.index);

      const isUnchanged =
        previous?.x === zone.x &&
        previous.y === zone.y &&
        previous.width === zone.width &&
        previous.height === zone.height;

      if (isUnchanged) {
        return;
      }

      zonesRef.current.set(zone.index, zone);
      onZonesChange?.([...zonesRef.current.values()]);
    },
    [onZonesChange]
  );

  if (pairs.length === 0) {
    return (
      <View style={styles.root}>
        <Text style={styles.empty}>{t('table.attackerTurn')}</Text>
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
          onMeasure={handleMeasure}
        />
      ))}
    </View>
  );
};
