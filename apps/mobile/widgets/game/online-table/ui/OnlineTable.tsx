import { match } from 'ts-pattern';

import { useOnlineGame, useSessionStore } from '@/entities/session';

import { useTableChatter, useTableSounds, useTableStage } from '../model';
import { DurakTable, SwipeToLeave, UnsupportedGame, WaitingRoom } from './components';

export const OnlineTable = () => {
  const currentTable = useSessionStore((store) => store.currentTable);
  const leaveTable = useSessionStore((store) => store.leaveTable);
  const setReady = useSessionStore((store) => store.setReady);
  const addBot = useSessionStore((store) => store.addBot);

  const game = useOnlineGame();
  const phrases = useTableChatter();
  const stage = useTableStage(game.view);

  useTableSounds(game.view, game.isMyTurn);

  return match(stage)
    .with({ kind: 'absent' }, () => null)
    .with({ kind: 'unsupported' }, ({ game: unsupported }) => (
      <UnsupportedGame game={unsupported} onLeave={leaveTable} />
    ))
    .with({ kind: 'waiting' }, () =>
      currentTable ? (
        <SwipeToLeave onLeave={leaveTable}>
          <WaitingRoom
            mySeat={game.mySeat}
            table={currentTable}
            onAddBot={addBot}
            onLeave={leaveTable}
            onReady={setReady}
          />
        </SwipeToLeave>
      ) : null
    )
    .with({ kind: 'playing' }, ({ settings, view }) => (
      <SwipeToLeave onLeave={leaveTable}>
        <DurakTable
          game={game}
          phrases={phrases}
          settings={settings}
          view={view}
          onLeave={leaveTable}
        />
      </SwipeToLeave>
    ))
    .exhaustive();
};
