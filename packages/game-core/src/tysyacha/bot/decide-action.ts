import type { TysyachaAction, TysyachaState } from '@durak-master/schemas';

import { MARRIAGE_POINTS, MIN_BID } from '@durak-master/schemas';

import { bidCeiling, cardPoints, legalPlays, marriageSuits } from '../rules';

const highestBid = (state: TysyachaState): number =>
  state.bids.reduce((best, bid) => Math.max(best, bid.value ?? 0), 0);

function decideMarriage(
  state: TysyachaState,
  hand: TysyachaState['hands'][string],
  userId: string
): TysyachaAction | null {
  if (state.trick.length > 0) {
    return null;
  }

  if (!state.rules.marriageOnFirstTrick && (state.wonCards[userId] ?? []).length === 0) {
    return null;
  }

  const suits = marriageSuits(hand);

  if (suits.length === 0) {
    return null;
  }

  const best = [...suits].sort((a, b) => MARRIAGE_POINTS[b] - MARRIAGE_POINTS[a])[0];

  if (!best) {
    return null;
  }

  const card = hand.find((item) => item.suit === best && item.rank === 'queen');

  return card ? { type: 'declareMarriage', suit: best, card } : null;
}

export function decideBotAction(state: TysyachaState, userId: string): TysyachaAction {
  const hand = state.hands[userId] ?? [];

  if (state.stage === 'bidding') {
    const minimum = highestBid(state) === 0 ? MIN_BID : highestBid(state) + state.rules.bidStep;

    return minimum <= bidCeiling(hand) ? { type: 'bid', value: minimum } : { type: 'pass' };
  }

  if (state.stage === 'discarding') {
    const sorted = [...hand].sort((a, b) => cardPoints(a) - cardPoints(b));
    const cards = sorted.slice(0, 2);
    const opponents = state.players.filter((player) => player.seat !== state.declarerSeat);

    return {
      type: 'discard',
      cards,
      gifts: opponents
        .map((player, index) => ({
          seat: player.seat,
          card: cards[index] ?? cards[0]
        }))
        .filter((gift): gift is { seat: number; card: (typeof cards)[number] } =>
          Boolean(gift.card)
        )
    };
  }

  const marriage = decideMarriage(state, hand, userId);

  if (marriage) {
    return marriage;
  }

  const options = legalPlays(hand, state);
  const choice = options[0];

  return choice ? { type: 'play', card: choice } : { type: 'pass' };
}
