import type { Card, Rank, Suit } from '@durak-master/schemas';

import { isJoker, RANKS } from '@durak-master/schemas';

export function rankValue(rank: Rank): number {
  return RANKS.indexOf(rank);
}

export function beats(defense: Card, attack: Card, trump: Suit): boolean {
  if (isJoker(attack)) {
    return false;
  }

  if (isJoker(defense)) {
    return true;
  }

  const defenseIsTrump = defense.suit === trump;
  const attackIsTrump = attack.suit === trump;

  if (defenseIsTrump && !attackIsTrump) {
    return true;
  }

  if (!defenseIsTrump && attackIsTrump) {
    return false;
  }

  if (defense.suit !== attack.suit) {
    return false;
  }

  return rankValue(defense.rank) > rankValue(attack.rank);
}
