import { useState } from 'react';
import { match } from 'ts-pattern';

import { useSessionStore } from '@/entities/session';
import { DurakTable } from '@/widgets/game/durak-table';
import { SwipeToLeave, UnsupportedGame, useTableStage } from '@/widgets/game/online-table';
import { PlayerCard } from '@/widgets/profile/player-card';

export const TableRouter = () => {
  const leaveTable = useSessionStore((store) => store.leaveTable);
  const tablePlayers = useSessionStore((store) => store.tablePlayers);

  const stage = useTableStage();

  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);

  return match(stage)
    .with({ kind: 'absent' }, () => null)
    .with({ kind: 'unsupported' }, ({ game }) => (
      <UnsupportedGame game={game} onLeave={leaveTable} />
    ))
    .with({ kind: 'game' }, ({ settings }) => (
      <SwipeToLeave onLeave={leaveTable}>
        <DurakTable settings={settings} onLeave={leaveTable} onSelectPlayer={setSelectedUserId} />

        <PlayerCard
          isOpen={selectedUserId !== null}
          profile={tablePlayers.find((player) => player.userId === selectedUserId) ?? null}
          onClose={() => setSelectedUserId(null)}
        />
      </SwipeToLeave>
    ))
    .exhaustive();
};
