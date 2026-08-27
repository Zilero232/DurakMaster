import type { BurkozelAction, BurkozelState, Card } from '@durak-master/schemas';

import { setBeatsSet, setPoints } from '../rules';

/** Every set of `size` cards the hand can answer with, order preserved. */
function combinations(cards: readonly Card[], size: number): Card[][] {
  if (size === 0) {
    return [[]];
  }

  const result: Card[][] = [];

  for (let index = 0; index <= cards.length - size; index++) {
    const head = cards[index];

    if (!head) {
      continue;
    }

    for (const tail of combinations(cards.slice(index + 1), size - 1)) {
      result.push([head, ...tail]);
    }
  }

  return result;
}

/** Leads the longest suit: more cards at once means more of them to unload. */
function cheapestLead(hand: readonly Card[]): Card[] {
  const bySuit = new Map<string, Card[]>();

  for (const card of hand) {
    bySuit.set(card.suit, [...(bySuit.get(card.suit) ?? []), card]);
  }

  let best: Card[] = hand[0] ? [hand[0]] : [];

  for (const cards of bySuit.values()) {
    if (cards.length > best.length) {
      best = cards;
    }
  }

  return best;
}

export function decideBotAction(state: BurkozelState, userId: string): BurkozelAction {
  const hand = state.hands[userId] ?? [];

  if (state.trick.length === 0) {
    return { type: 'play', cards: cheapestLead(hand) };
  }

  const required = Math.min(state.trick[0]?.cards.length ?? 1, hand.length);
  const options = combinations(hand, required);
  const best = state.bestPlayIndex === null ? null : state.trick[state.bestPlayIndex];

  if (best) {
    // Take the trick with the cheapest set that does it, keeping the points in hand.
    const beating = options
      .filter((cards) => setBeatsSet(cards, best.cards, state.trump, state.rules))
      .sort((a, b) => setPoints(a) - setPoints(b));

    const winner = beating[0];

    if (winner) {
      return { type: 'play', cards: winner };
    }
  }

  const discard =
    [...options].sort((a, b) => setPoints(a) - setPoints(b))[0] ?? hand.slice(0, required);

  return { type: 'play', cards: discard };
}
