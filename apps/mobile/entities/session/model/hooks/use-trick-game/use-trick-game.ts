import type { Card } from '@durak-master/schemas';

import { cardKey } from '@/shared/lib/cards';

import { useGameSeat } from '../use-game-seat';

export const useKozelGame = () => {
  const { view, profile, players, mySeat, isMyTurn, outcome, play } = useGameSeat('kozel');

  return {
    view,
    profile,
    players,
    mySeat,
    isMyTurn,
    outcome,
    playableKeys: new Set(isMyTurn ? (view?.hand ?? []).map(cardKey) : []),
    playCard: (card: Card) => play({ type: 'play', card }),
    chooseLeader: (seat: number) => play({ type: 'chooseLeader', seat })
  };
};

export type KozelGame = ReturnType<typeof useKozelGame>;
