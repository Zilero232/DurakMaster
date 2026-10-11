import type { Card } from '@durak-master/schemas';

import { cardKey } from '@/shared/lib/cards';
import { canTransferCard, getBeatableIndexes, getPlayableKeys } from '@/shared/lib/games';
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

  const isDefending = view?.defenderSeat === mySeat;
  const isTransferMode = view?.rules.mode === 'transfer';

  const selectedCard = view?.hand.find((card) => cardKey(card) === selectedKey) ?? null;
  const playableKeys = getPlayableKeys(view, isMyTurn, isDefending, mySeat);
  const beatableIndexes =
    isDefending && isMyTurn ? getBeatableIndexes(view, selectedCard) : new Set<number>();

  const hasUndefended = view?.table.some((pair) => pair.defense === null) ?? false;

  const isOut = view?.players.find((player) => player.seat === mySeat)?.isOut ?? false;

  const canPass =
    view !== null &&
    view.phase === 'playing' &&
    !isDefending &&
    !isOut &&
    view.table.length > 0 &&
    !view.passedSeats.includes(mySeat) &&
    (view.isTaking || !hasUndefended);

  const beatableWith = (card: Card): Set<number> => getBeatableIndexes(view, card);

  const canTransfer = (card: Card): boolean =>
    isDefending && isMyTurn && canTransferCard(view, card);

  const transfer = (card: Card) => {
    play({ type: 'transfer', card });
    setSelectedKey(null);
  };

  const selectCard = (card: Card) => {
    const key = cardKey(card);

    if (!isDefending) {
      play({ type: 'attack', card });

      return;
    }

    if (canTransfer(card) && beatableWith(card).size === 0) {
      transfer(card);

      return;
    }

    playSound('click');
    haptic('tap');
    setSelectedKey(selectedKey === key ? null : key);
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

  return {
    view,
    profile,
    players,
    readyUserIds,
    mySeat,
    isMyTurn,
    isDefending,
    isTransferMode,
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

      return last.defense === null ? last.attackSeat === mySeat : last.defenseSeat === mySeat;
    })(),
    canPass,
    selectCard,
    attackWith,
    defendPair,
    defendPairWith,
    beatableWith,
    canTransfer,
    transfer,

    take: () => play({ type: 'take' }),

    pass: () => play({ type: 'pass' })
  };
};

export type OnlineGame = ReturnType<typeof useOnlineGame>;
