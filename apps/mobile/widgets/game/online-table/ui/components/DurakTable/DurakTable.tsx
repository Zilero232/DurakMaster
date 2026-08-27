import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { RewardBurst } from '@/entities/game-table';
import { useLayout } from '@/shared/model/layout';
import { ContentWidth, FeltBackground, TABLE_MAX_WIDTH } from '@/ui-kit';

import type { DurakTableProps } from './DurakTable.types';

import { createTableValue } from '../../../lib';
import { TableProvider, useDurakTable } from '../../../model';
import { LeaveCorner } from '../LeaveCorner';
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
  onLeave
}: DurakTableProps) => {
  const insets = useSafeAreaInsets();

  const { isWide } = useLayout();

  const table = useDurakTable({ game });

  const value = createTableValue({ game, table, settings, phrases, isWaiting });

  return (
    <TableProvider value={value}>
      <FeltBackground style={styles.root}>
        <ContentWidth
          maxWidth={TABLE_MAX_WIDTH}
          style={[styles.table, { paddingTop: insets.top, paddingBottom: insets.bottom }]}
        >
          {isWide && <LeaveCorner onLeave={onLeave} />}

          <OpponentsRow
            loserUserId={game.outcome?.loserUserId ?? null}
            mySeat={game.mySeat}
            phrases={phrases}
            players={game.players}
            turnSeconds={settings.turnTimeoutSeconds}
            view={view}
          />

          <TableCenter
            beatableIndexes={table.drag.targets ?? game.beatableIndexes}
            cardScale={table.cardScale}
            hoveredIndex={table.drag.hoveredIndex}
            isInstant={table.isInstant}
            isWaiting={isWaiting}
            maxPlayers={settings.maxPlayers}
            mySeat={game.mySeat}
            view={view}
            onDefend={game.defendPair}
            onZonesChange={table.drag.setDropZones}
          />

          <PlayerZone view={view} />

          {game.outcome && (
            <RewardBurst
              creditsDelta={game.outcome.creditsDelta}
              ratingDelta={game.outcome.ratingDelta}
            />
          )}
        </ContentWidth>
      </FeltBackground>
    </TableProvider>
  );
};
