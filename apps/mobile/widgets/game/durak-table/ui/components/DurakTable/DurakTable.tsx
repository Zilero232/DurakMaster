import { View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { LeaveButton, RevealedCards } from '@/entities/game-table';
import { useSessionStore } from '@/entities/session';
import { FeltBackground } from '@/ui-kit';

import type { DurakTableProps } from './DurakTable.types';

import { createTableValue } from '../../../lib';
import { TableProvider, useDurakTable, useLeaveTable } from '../../../model';
import { OpponentsRow } from '../OpponentsRow';
import { PlayerZone } from '../PlayerZone';
import { TableCenter } from '../TableCenter';
import { styles, TABLE_BOTTOM_GAP } from './DurakTable.styles';

export const DurakTable = ({
  game,
  settings,
  view,
  phrases,
  isWaiting,
  onInviteFriends,
  onLeave,
  onSelectPlayer
}: DurakTableProps) => {
  const insets = useSafeAreaInsets();

  const revealed = useSessionStore((store) => store.revealed);
  const clearRevealed = useSessionStore((store) => store.clearRevealed);

  const table = useDurakTable({ game });
  const leave = useLeaveTable({ isPlaying: !isWaiting, onLeave });

  const value = createTableValue({
    game,
    table,
    settings,
    phrases,
    isWaiting,
    onInviteFriends
  });

  return (
    <TableProvider value={value}>
      <FeltBackground style={styles.root}>
        <View
          style={[
            styles.table,
            { paddingTop: insets.top, paddingBottom: insets.bottom + TABLE_BOTTOM_GAP }
          ]}
        >
          <LeaveButton
            isConfirming={leave.isConfirming}
            isPlaying={!isWaiting}
            onCancel={leave.cancelLeave}
            onConfirm={leave.confirmLeave}
            onPress={leave.requestLeave}
          />

          <OpponentsRow
            mySeat={game.mySeat}
            phrases={phrases}
            players={game.players}
            readyUserIds={game.readyUserIds}
            turnSeconds={settings.turnTimeoutSeconds}
            view={view}
            onSelectPlayer={onSelectPlayer}
          />

          <TableCenter
            beatableIndexes={table.drag.targets ?? game.beatableIndexes}
            hoveredIndex={table.drag.hoveredIndex}
            isInstant={table.isInstant}
            mySeat={game.mySeat}
            view={view}
            onDefend={game.defendPair}
          />

          <PlayerZone view={view} />

          <RevealedCards
            boost={revealed?.boost ?? null}
            cards={revealed?.cards ?? []}
            onClose={clearRevealed}
          />
        </View>
      </FeltBackground>
    </TableProvider>
  );
};
