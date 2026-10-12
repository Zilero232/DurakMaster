import { match } from 'ts-pattern';

import { useSessionStore } from '@/entities/session';
import { InviteFriendsSheet } from '@/features/social/invite-friends';
import { DurakTable, isWaitingForPlayers } from '@/widgets/game/durak-table';
import { useTableStage } from '@/widgets/game/online-table';
import { PlayerCard } from '@/widgets/profile/player-card';

import { useTableSheets } from '../../model';

export const TableRouter = () => {
  const leaveTable = useSessionStore((store) => store.leaveTable);
  const currentTable = useSessionStore((store) => store.currentTable);
  const view = useSessionStore((store) => store.view);

  const stage = useTableStage();

  const isWaiting = isWaitingForPlayers({ table: currentTable, view });

  const sheets = useTableSheets({ isWaiting });

  return match(stage)
    .with({ kind: 'absent' }, () => null)
    .with({ kind: 'game' }, ({ settings }) => (
      <>
        <DurakTable settings={settings} onLeave={leaveTable} onSelectPlayer={sheets.selectSeat} />

        <PlayerCard
          isOpen={sheets.isPlayerCardOpen}
          profile={sheets.selectedPlayer}
          onClose={sheets.closePlayerCard}
        />

        <InviteFriendsSheet isOpen={sheets.isInviteOpen} onClose={sheets.closeInvite} />
      </>
    ))
    .exhaustive();
};
