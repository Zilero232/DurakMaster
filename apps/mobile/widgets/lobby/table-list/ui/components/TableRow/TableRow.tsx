import { LinearGradient } from 'expo-linear-gradient';
import { Pressable } from 'react-native';

import { gradientEnds, surfaceGradient } from '@/ui-kit';

import type { TableRowProps } from './TableRow.types';

import { TableCompact, TableTile } from './components';
import { styles } from './TableRow.styles';

export const TableRow = ({
  table,
  isTile = false,
  isPending = false,
  myUserId,
  onJoin
}: TableRowProps) => {
  const { players, settings, hasPremiumPlayer } = table;

  const isPlaying = table.status === 'playing';
  const isBlocked = players.length >= settings.maxPlayers || isPlaying;
  const isInactive = isBlocked || isPending;

  const View = isTile ? TableTile : TableCompact;

  return (
    <Pressable
      style={({ pressed }) => [
        styles.root,
        isTile && styles.tile,
        hasPremiumPlayer && styles.premium,
        isInactive && styles.blocked,
        pressed && styles.pressed
      ]}
      accessibilityRole='button'
      accessibilityState={{ busy: isPending, disabled: isInactive }}
      disabled={isInactive}
      onPress={() => onJoin(table.id)}
    >
      <LinearGradient
        colors={surfaceGradient.raised}
        end={gradientEnds.vertical.end}
        start={gradientEnds.vertical.start}
        style={styles.fill}
      />

      <View
        isBlocked={isBlocked}
        isMine={table.ownerId === myUserId}
        isPlaying={isPlaying}
        table={table}
      />
    </Pressable>
  );
};
