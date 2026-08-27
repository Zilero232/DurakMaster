import type { BurkozelState, Card } from '@durak-master/schemas';

import { userIdAtSeat, withHandCounts } from '../../shared';
import { finishDeal } from './finish-deal';
import { refill } from './refill';

/**
 * Hands the trick to whoever played the last winning set, refills from the
 * talon and passes the lead. Once the talon and every hand are empty the deal
 * is over and gets scored.
 */
export function resolveTrick(state: BurkozelState, hands: Record<string, Card[]>): BurkozelState {
  const bestPlay = state.bestPlayIndex === null ? null : state.trick[state.bestPlayIndex];
  const takerSeat = bestPlay?.seat ?? state.leadSeat;
  const takerId = userIdAtSeat(state.players, takerSeat);

  if (!takerId) {
    return state;
  }

  const taken = state.trick.flatMap((play) => play.cards);
  const wonCards: Record<string, Card[]> = {
    ...state.wonCards,
    [takerId]: [...(state.wonCards[takerId] ?? []), ...taken]
  };
  const tricksWon: Record<string, number> = {
    ...state.tricksWon,
    [takerId]: (state.tricksWon[takerId] ?? 0) + 1
  };

  const refilled = refill(state, hands, takerSeat);
  const isDealOver = Object.values(refilled.hands).every((hand) => hand.length === 0);

  const settled: BurkozelState = {
    ...state,
    wonCards,
    tricksWon,
    talon: refilled.talon,
    trick: [],
    bestPlayIndex: null,
    leadSeat: takerSeat,
    activeSeat: takerSeat
  };

  if (isDealOver) {
    return finishDeal(settled, refilled.hands);
  }

  return {
    ...settled,
    hands: refilled.hands,
    players: withHandCounts(settled.players, refilled.hands),
    turnDeadline: null,
    version: state.version + 1
  };
}
