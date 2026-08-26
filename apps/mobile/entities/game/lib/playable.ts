import type { Card, PlayerView } from '@durak-master/schemas';

import { beats, isLegalAttackCard } from '@durak-master/game-core';

import { cardKey } from '@/ui-kit';

export const getPlayableKeys = (
  view: PlayerView | null,
  isMyTurn: boolean,
  isDefending: boolean
): Set<string> => {
  const keys = new Set<string>();

  if (!view || !isMyTurn) {
    return keys;
  }

  for (const card of view.hand) {
    if (isDefending) {
      const canBeatSomething = view.table.some(
        (pair) => pair.defense === null && beats(card, pair.attack, view.trump)
      );

      if (canBeatSomething) {
        keys.add(cardKey(card));
      }

      continue;
    }

    if (isLegalAttackCard(card, view.table, view.attackLimit)) {
      keys.add(cardKey(card));
    }
  }

  return keys;
};

export const getBeatableIndexes = (
  view: PlayerView | null,
  selectedCard: Card | null
): Set<number> => {
  const indexes = new Set<number>();

  if (!view || !selectedCard) {
    return indexes;
  }

  view.table.forEach((pair, index) => {
    if (pair.defense === null && beats(selectedCard, pair.attack, view.trump)) {
      indexes.add(index);
    }
  });

  return indexes;
};
