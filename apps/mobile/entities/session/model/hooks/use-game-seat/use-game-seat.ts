import type { ActionForGame, GameId, PlayerView, ViewForGame } from '@durak-master/schemas';

import { useMyProfile } from '../../../api';
import { sendGameAction, useSessionStore } from '../../store';

const viewForGame = <G extends GameId>(view: PlayerView | null, game: G) =>
  view?.game === game ? (view as ViewForGame<G>) : null;

export const useGameSeat = <G extends GameId>(game: G) => {
  const rawView = useSessionStore((store) => store.view);
  const { profile } = useMyProfile();
  const players = useSessionStore((store) => store.tablePlayers);
  const currentTable = useSessionStore((store) => store.currentTable);
  const storedSeat = useSessionStore((store) => store.mySeat);
  const outcome = useSessionStore((store) => store.outcome);
  const setReady = useSessionStore((store) => store.setReady);
  const addBot = useSessionStore((store) => store.addBot);

  const view = viewForGame(rawView, game);

  const mySeat =
    view?.players.find((player) => player.userId === profile?.userId)?.seat ??
    currentTable?.players.find((player) => player.userId === profile?.userId)?.seat ??
    storedSeat ??
    0;

  const isMyTurn = Boolean(view) && view?.activeSeat === mySeat && view?.phase !== 'finished';

  const seatCount = currentTable?.settings.maxPlayers ?? 0;

  const readyUserIds = new Set(
    (currentTable?.players ?? []).filter((player) => player.isReady).map((player) => player.userId)
  );

  const seated =
    players.length > 0
      ? players
      : (currentTable?.players ?? []).map((player) => ({
          userId: player.userId,
          name: player.name,
          avatarUrl: player.avatarUrl,
          rating: player.rating,
          seasonRating: 0,
          gamesPlayed: 0,
          gamesWon: 0,
          gamesLost: 0,
          isPremium: false,
          isOnline: true
        }));

  const seats =
    view?.players ??
    Array.from({ length: seatCount }, (_, seat) => {
      const taken = currentTable?.players.find((player) => player.seat === seat);

      return {
        userId: taken?.userId ?? `seat-${seat}`,
        seat,
        handCount: 0,
        isOut: false,
        outPlace: null,
        isDisconnected: false
      };
    });

  const isWaiting = !view || view.phase === 'waiting' || currentTable?.status === 'waiting';
  const isReady = readyUserIds.has(profile?.userId ?? '');
  const hasFreeSeat = (currentTable?.players.length ?? 0) < seatCount;

  const play = (action: ActionForGame<G>['action']) => {
    if (!view) {
      return;
    }

    sendGameAction({ game, action } as ActionForGame<GameId>, view.version);
  };

  return {
    view,
    profile,
    players: seated,
    seats,
    readyUserIds,
    mySeat,
    isMyTurn,
    isWaiting,
    isReady,
    hasFreeSeat,
    outcome,
    play,
    setReady,
    addBot
  };
};
