import { match } from 'ts-pattern';

import { useOnlineGame, useSessionStore } from '@/entities/session';

import { useTableChatter, useTableSounds, useTableStage } from '../model';
import { DurakTable, SwipeToLeave, UnsupportedGame } from './components';

export const OnlineTable = () => {
  const leaveTable = useSessionStore((store) => store.leaveTable);

  const game = useOnlineGame();
  const phrases = useTableChatter();
  const stage = useTableStage(game.view);

  useTableSounds(game.view, game.isMyTurn);

  return match(stage)
    .with({ kind: 'absent' }, () => null)
    .with({ kind: 'unsupported' }, ({ game: unsupported }) => (
      <UnsupportedGame game={unsupported} onLeave={leaveTable} />
    ))
    .with({ kind: 'table' }, ({ settings, view, isWaiting }) => (
      <SwipeToLeave onLeave={leaveTable}>
        <DurakTable
          game={game}
          isWaiting={isWaiting}
          phrases={phrases}
          settings={settings}
          view={view}
          onLeave={leaveTable}
        />
      </SwipeToLeave>
    ))
    .exhaustive();
};
