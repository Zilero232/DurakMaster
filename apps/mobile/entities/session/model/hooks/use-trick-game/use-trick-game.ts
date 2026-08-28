import type { Card, ViewForGame } from '@durak-master/schemas';

import { kozelLegalCards, teamOfSeat } from '@durak-master/game-core';

import { cardKey } from '@/shared/lib/cards';

import { useGameSeat } from '../use-game-seat';

const legalKeys = (view: ViewForGame<'kozel'> | null, isMyTurn: boolean): Set<string> => {
  if (!view || !isMyTurn || view.phase !== 'playing') {
    return new Set();
  }

  const legal = kozelLegalCards({
    hand: view.hand,
    trick: view.trick.map((entry) => entry.card),
    rules: view.rules,
    isFirstTrick: view.trickNumber === 0,
    unledSuits: new Set(view.unledSuits)
  });

  return new Set(legal.map(cardKey));
};

export const useKozelGame = () => {
  const {
    view,
    profile,
    players,
    seats,
    readyUserIds,
    isWaiting,
    isReady,
    hasFreeSeat,
    mySeat,
    isMyTurn,
    outcome,
    play,
    setReady,
    addBot
  } = useGameSeat('kozel');

  return {
    view,
    profile,
    players,
    seats,
    readyUserIds,
    isWaiting,
    isReady,
    hasFreeSeat,
    setReady,
    addBot,
    mySeat,
    isMyTurn,
    outcome,
    playableKeys: legalKeys(view, isMyTurn),

    isChoosingLeader: view?.phase === 'chooseLeader',
    canChooseLeader:
      view?.phase === 'chooseLeader' && teamOfSeat(mySeat) === teamOfSeat(view.leadSeat),
    partnerSeat: (mySeat + 2) % 4,
    playCard: (card: Card) => play({ type: 'play', card }),
    chooseLeader: (seat: number) => play({ type: 'chooseLeader', seat })
  };
};

export type KozelGame = ReturnType<typeof useKozelGame>;
