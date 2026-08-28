import type { Card } from '@durak-master/schemas';

import { cardKey } from '@/shared/lib/cards';
import { getBeatableIndexes, getPlayableKeys } from '@/shared/lib/games';
import { haptic } from '@/shared/lib/haptics';
import { playSound } from '@/shared/lib/sound';

import { useSessionStore } from '../../store';
import { useGameSeat } from '../use-game-seat';

export const useOnlineGame = () => {
  const { view, profile, players, readyUserIds, mySeat, isMyTurn, outcome, play } =
    useGameSeat('durak');

  const rejectedCode = useSessionStore((store) => store.rejectedCode);
  const selectedKey = useSessionStore((store) => store.selectedTableCardKey);
  const setSelectedKey = useSessionStore((store) => store.selectTableCard);

  const seat = mySeat;
  const isDefending = Boolean(view) && view?.defenderSeat === seat;

  const selectedCard = view?.hand.find((card) => cardKey(card) === selectedKey) ?? null;
  const playableKeys = getPlayableKeys(view, isMyTurn, isDefending, seat);
  const beatableIndexes =
    isDefending && isMyTurn ? getBeatableIndexes(view, selectedCard) : new Set<number>();

  const hasUndefended = view?.table.some((pair) => pair.defense === null) ?? false;

  const canPass = (current: typeof view, mySeat: number, amDefending: boolean): boolean => {
    if (!current || amDefending || current.phase !== 'playing') {
      return false;
    }

    if (current.table.length === 0 || current.passedSeats.includes(mySeat)) {
      return false;
    }

    return current.isTaking || !hasUndefended;
  };

  const selectCard = (card: Card) => {
    const key = cardKey(card);

    if (isDefending) {
      playSound('click');
      haptic('tap');
      setSelectedKey(selectedKey === key ? null : key);

      return;
    }

    play({ type: 'attack', card });
  };

  const defendPair = (pairIndex: number) => {
    if (!selectedCard) {
      return;
    }

    play({ type: 'defend', pairIndex, card: selectedCard });
    setSelectedKey(null);
  };

  const defendPairWith = (pairIndex: number, card: Card) => {
    play({ type: 'defend', pairIndex, card });
    setSelectedKey(null);
  };

  const attackWith = (card: Card) => {
    play({ type: 'attack', card });
    setSelectedKey(null);
  };

  const beatableWith = (card: Card): Set<number> => getBeatableIndexes(view, card);

  return {
    view,
    profile,
    players,
    readyUserIds,
    mySeat: seat,
    isMyTurn,
    isDefending,
    selectedCard,
    selectedKey,
    playableKeys,
    beatableIndexes,
    outcome,
    rejectedCode,
    canTake: isMyTurn && isDefending && (view?.table.length ?? 0) > 0 && !view?.isTaking,

    canUndo: (() => {
      const last = view?.table.at(-1);

      if (!view || !last || view.isTaking) {
        return false;
      }

      return last.defense === null ? last.attackSeat === seat : last.defenseSeat === seat;
    })(),
    canPass: canPass(view, seat, isDefending),
    selectCard,
    attackWith,
    defendPair,
    defendPairWith,
    beatableWith,

    take: () => play({ type: 'take' }),

    pass: () => play({ type: 'pass' }),

    transfer: (card: Card) => play({ type: 'transfer', card })
  };
};

export type OnlineGame = ReturnType<typeof useOnlineGame>;
