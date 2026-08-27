import { useTranslation } from 'react-i18next';
import { Text, View } from 'react-native';

import { DiscardStack, TableField, TalonStack } from '@/entities/game-table';

import type { TableCenterProps } from './TableCenter.types';

import { styles } from './TableCenter.styles';

export const TableCenter = ({
  view,
  beatableIndexes,
  hoveredIndex,
  cardScale,
  mySeat,
  isWaiting,
  maxPlayers,
  isInstant,
  onDefend,
  onZonesChange
}: TableCenterProps) => {
  const { t } = useTranslation();

  if (isWaiting) {
    return (
      <View style={[styles.root, styles.waiting]}>
        <Text style={styles.waitingTitle}>{t('table.waitingTitle')}</Text>

        <Text style={styles.waitingCount}>
          {t('table.waitingCount', { current: view.players.length, max: maxPlayers })}
        </Text>
      </View>
    );
  }

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
        onZonesChange={onZonesChange}
      />

      <DiscardStack count={view.discardCount} />
    </View>
  );
};
