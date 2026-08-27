import type { ActionForGame, GameId, PlayerView, ViewForGame } from '@durak-master/schemas';

import { sendGameAction, useSessionStore } from '../../store';

const viewForGame = <G extends GameId>(view: PlayerView | null, game: G) =>
  view?.game === game ? (view as ViewForGame<G>) : null;

export const useGameSeat = <G extends GameId>(game: G) => {
  const rawView = useSessionStore((store) => store.view);
  const profile = useSessionStore((store) => store.profile);
  const players = useSessionStore((store) => store.tablePlayers);
  const currentTable = useSessionStore((store) => store.currentTable);
  const storedSeat = useSessionStore((store) => store.mySeat);
  const outcome = useSessionStore((store) => store.outcome);

  const view = viewForGame(rawView, game);

  const mySeat =
    view?.players.find((player) => player.userId === profile?.userId)?.seat ??
    currentTable?.players.find((player) => player.userId === profile?.userId)?.seat ??
    storedSeat ??
    0;

  const isMyTurn = Boolean(view) && view?.activeSeat === mySeat && view?.phase !== 'finished';

  const play = (action: ActionForGame<G>['action']) => {
    if (!view) {
      return;
    }

    sendGameAction({ game, action } as ActionForGame<GameId>, view.version);
  };

  return { view, profile, players, mySeat, isMyTurn, outcome, play };
};
