import { Pressable } from 'react-native';

import type { TableRowProps } from './TableRow.types';

import { TableCompact, TableTile } from './components';
import { styles } from './TableRow.styles';

export const TableRow = ({ table, isTile = false, onJoin }: TableRowProps) => {
  const { players, settings, hasPremiumPlayer } = table;

  const isPlaying = table.status === 'playing';
  const isBlocked = players.length >= settings.maxPlayers || isPlaying;

  const View = isTile ? TableTile : TableCompact;

  return (
    <Pressable
      style={({ pressed }) => [
        styles.root,
        isTile && styles.tile,
        hasPremiumPlayer && styles.premium,
        isBlocked && styles.blocked,
        pressed && styles.pressed
      ]}
      accessibilityRole='button'
      accessibilityState={{ disabled: isBlocked }}
      disabled={isBlocked}
      onPress={() => onJoin(table.id)}
    >
      <View isBlocked={isBlocked} isPlaying={isPlaying} table={table} />
    </Pressable>
  );
};
