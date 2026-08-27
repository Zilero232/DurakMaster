import type { TysyachaAction, TysyachaState } from '@durak-master/schemas';

import { MIN_BID } from '@durak-master/schemas';

import { bidCeiling, cardPoints, legalPlays } from '../rules';

const highestBid = (state: TysyachaState): number =>
  state.bids.reduce((best, bid) => Math.max(best, bid.value ?? 0), 0);

export function decideBotAction(state: TysyachaState, userId: string): TysyachaAction {
  const hand = state.hands[userId] ?? [];

  if (state.stage === 'bidding') {
    const minimum = highestBid(state) === 0 ? MIN_BID : highestBid(state) + state.rules.bidStep;

    return minimum <= bidCeiling(hand) && minimum <= MIN_BID + state.rules.bidStep
      ? { type: 'bid', value: minimum }
      : { type: 'pass' };
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

  const options = legalPlays(hand, state);
  const choice = options[0];

  return choice ? { type: 'play', card: choice } : { type: 'pass' };
}
