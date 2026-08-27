import type { TysyachaState, TysyachaView } from '@durak-master/schemas';

import { handPoints } from './rules';

export function toPlayerView(state: TysyachaState, userId: string): TysyachaView {
  const { hands, widow, wonCards, ...rest } = state;

  const isDeclarer =
    state.players.find((player) => player.userId === userId)?.seat === state.declarerSeat;
  const isWidowOpen = state.stage !== 'bidding';

  return {
    ...rest,
    hand: hands[userId] ?? [],
    widowCards: isWidowOpen || isDeclarer ? widow : null,
    widowCount: widow.length,
    myTrickPoints: handPoints(wonCards[userId] ?? [])
  };
}
