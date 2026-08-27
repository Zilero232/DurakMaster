import type { Card } from '@durak-master/schemas';

import { useState } from 'react';

import { cardKey } from '@/shared/lib/cards';

import { useGameSeat } from '../use-game-seat';

export const useBurkozelGame = () => {
  const { view, profile, players, mySeat, isMyTurn, outcome, play } = useGameSeat('burkozel');

  const [selectedKeys, setSelectedKeys] = useState<string[]>([]);
  const [trickId, setTrickId] = useState('');

  const hand = view?.hand ?? [];
  const isLeading = view?.trick.length === 0;
  const requiredCount = Math.min(view?.trick[0]?.cardCount ?? 0, hand.length);

  const handKeys = new Set(hand.map(cardKey));
  const liveKeys = selectedKeys.filter((key) => handKeys.has(key));

  if (liveKeys.length !== selectedKeys.length) {
    setSelectedKeys(liveKeys);
  }

  const selectedCards = hand.filter((card) => liveKeys.includes(cardKey(card)));

  const currentTrickId = `${view?.leadSeat ?? -1}:${view?.trick.length ?? 0}`;

  if (trickId !== currentTrickId) {
    setTrickId(currentTrickId);
    setSelectedKeys([]);
  }

  const toggleCard = (card: Card) => {
    const key = cardKey(card);

    setSelectedKeys((current) =>
      current.includes(key) ? current.filter((item) => item !== key) : [...current, key]
    );
  };

  return {
    view,
    profile,
    players,
    mySeat,
    isMyTurn,
    isLeading,
    requiredCount,
    outcome,
    selectedKeys: new Set(liveKeys),
    playableKeys: new Set(isMyTurn ? hand.map(cardKey) : []),
    canPlay:
      isMyTurn && selectedCards.length > 0 && (isLeading || selectedCards.length === requiredCount),
    toggleCard,
    playSelected: () => {
      play({ type: 'play', cards: selectedCards });
      setSelectedKeys([]);
    }
  };
};

export type BurkozelGame = ReturnType<typeof useBurkozelGame>;
