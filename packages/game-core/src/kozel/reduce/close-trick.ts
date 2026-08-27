import type { Card, KozelState } from '@durak-master/schemas';

import { KOZEL_TRICKS_PER_DEAL } from '@durak-master/schemas';

import { userIdAtSeat, withHandCounts } from '../../shared';
import { trickWinnerIndex } from '../rules';
import { finishDeal } from './finish-deal';

/** Awards the finished trick and hands the lead to whoever took it. */
export const closeTrick = (state: KozelState, hands: Record<string, Card[]>): KozelState => {
  const cards = state.trick.map((entry) => entry.card);
  const winnerIndex = trickWinnerIndex(cards, state.rules);
  const winnerSeat = state.trick[winnerIndex]?.seat ?? state.leadSeat;
  const winnerUserId = userIdAtSeat(state.players, winnerSeat);

  if (!winnerUserId) {
    return state;
  }

  const wonCards = {
    ...state.wonCards,
    [winnerUserId]: [...(state.wonCards[winnerUserId] ?? []), ...cards]
  };

  const tricksWon = {
    ...state.tricksWon,
    [winnerUserId]: (state.tricksWon[winnerUserId] ?? 0) + 1
  };

  const trickNumber = state.trickNumber + 1;
  const settled: KozelState = {
    ...state,
    hands,
    wonCards,
    tricksWon,
    trick: [],
    trickNumber,
    leadSeat: winnerSeat,
    activeSeat: winnerSeat,
    players: withHandCounts(state.players, hands),
    version: state.version + 1
  };

  if (trickNumber < KOZEL_TRICKS_PER_DEAL) {
    return settled;
  }

  return finishDeal(settled, hands);
};
