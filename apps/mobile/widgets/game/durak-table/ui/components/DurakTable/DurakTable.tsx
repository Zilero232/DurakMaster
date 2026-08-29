import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { LeaveCorner, RevealedCards, RewardBurst } from '@/entities/game-table';
import { useSessionStore } from '@/entities/session';
import { ContentWidth, FeltBackground, TABLE_MAX_WIDTH } from '@/ui-kit';

import type { DurakTableProps } from './DurakTable.types';

import { createTableValue } from '../../../lib';
import { TableProvider, useDurakTable } from '../../../model';
import { OpponentsRow } from '../OpponentsRow';
import { PlayerZone } from '../PlayerZone';
import { TableCenter } from '../TableCenter';
import { styles } from './DurakTable.styles';

export const DurakTable = ({
  game,
  settings,
  view,
  phrases,
  isWaiting,
  onLeave,
  onSelectPlayer
}: DurakTableProps) => {
  const insets = useSafeAreaInsets();

  const revealed = useSessionStore((store) => store.revealed);
  const clearRevealed = useSessionStore((store) => store.clearRevealed);

  const table = useDurakTable({ game });

  const value = createTableValue({ game, table, settings, phrases, isWaiting });

  return (
    <TableProvider value={value}>
      <FeltBackground style={styles.root}>
        <ContentWidth
          maxWidth={TABLE_MAX_WIDTH}
          style={[styles.table, { paddingTop: insets.top, paddingBottom: insets.bottom }]}
        >
          <LeaveCorner isPlaying={!isWaiting} onLeave={onLeave} />

          <OpponentsRow
            loserUserId={game.outcome?.loserUserId ?? null}
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
            cardScale={table.cardScale}
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

          {game.outcome && (
            <RewardBurst
              key={`${game.outcome.creditsDelta}:${game.outcome.ratingDelta}`}
              creditsDelta={game.outcome.creditsDelta}
              ratingDelta={game.outcome.ratingDelta}
            />
          )}
        </ContentWidth>
      </FeltBackground>
    </TableProvider>
  );
};
