import type { Card, PlayerState, Suit } from '@durak-master/schemas';

import { isJoker } from '@durak-master/schemas';

import { rankValue } from '../rules';

export function findFirstAttackerSeat(
  hands: Record<string, Card[]>,
  players: PlayerState[],
  trump: Suit
): number {
  let bestSeat = players[0]?.seat ?? 0;
  let bestTrump: number | null = null;
  let bestAny: number | null = null;
  let bestAnySeat = bestSeat;

  for (const player of players) {
    const hand = hands[player.userId] ?? [];

    for (const card of hand) {
      if (isJoker(card)) {
        continue;
      }

      const value = rankValue(card.rank);

      if (card.suit === trump && (bestTrump === null || value < bestTrump)) {
        bestTrump = value;
        bestSeat = player.seat;
      }

      if (bestAny === null || value < bestAny) {
        bestAny = value;
        bestAnySeat = player.seat;
      }
    }
  }

  return bestTrump === null ? bestAnySeat : bestSeat;
}
