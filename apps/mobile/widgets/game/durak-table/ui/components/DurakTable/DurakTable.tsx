import { useTranslation } from 'react-i18next';
import { View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { RevealedCards } from '@/entities/game-table';
import { useSessionStore } from '@/entities/session';
import { FeltBackground } from '@/ui-kit';

import type { DurakTableProps } from './DurakTable.types';

import { createTableValue, describeTableRules } from '../../../lib';
import { TableProvider, useDurakTable, useTableMenu } from '../../../model';
import { OpponentsRow } from '../OpponentsRow';
import { PlayerZone } from '../PlayerZone';
import { TableCenter } from '../TableCenter';
import { TableMenu } from '../TableMenu';
import { TableTopBar } from '../TableTopBar';
import { styles, TABLE_BOTTOM_GAP } from './DurakTable.styles';

export const DurakTable = ({
  game,
  settings,
  view,
  phrases,
  isWaiting,
  onLeave,
  onSelectPlayer
}: DurakTableProps) => {
  const { t } = useTranslation();
  const insets = useSafeAreaInsets();

  const revealed = useSessionStore((store) => store.revealed);
  const clearRevealed = useSessionStore((store) => store.clearRevealed);

  const table = useDurakTable({ game });
  const menu = useTableMenu({ isPlaying: !isWaiting, onLeave });

  const value = createTableValue({ game, table, settings, phrases, isWaiting, onLeave });
  const rules = describeTableRules({ settings, t });

  return (
    <TableProvider value={value}>
      <FeltBackground style={styles.root}>
        <View
          style={[
            styles.table,
            { paddingTop: insets.top, paddingBottom: insets.bottom + TABLE_BOTTOM_GAP }
          ]}
        >
          <TableTopBar rules={rules} onOpenMenu={menu.open} />

          <OpponentsRow
            isWaiting={isWaiting}
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
            canTransfer={table.canTransferNow}
            hoveredIndex={table.drag.hoveredIndex}
            isInstant={table.isInstant}
            mySeat={game.mySeat}
            view={view}
            onDefend={game.defendPair}
            onTransfer={table.transferToSlot}
          />

          <PlayerZone view={view} />

          <RevealedCards
            boost={revealed?.boost ?? null}
            cards={revealed?.cards ?? []}
            onClose={clearRevealed}
          />

          <TableMenu bet={settings.bet} isPlaying={!isWaiting} menu={menu} rules={rules} />
        </View>
      </FeltBackground>
    </TableProvider>
  );
};
