import type { BurkozelState, Card } from '@durak-master/schemas';

import type { BurkozelReduceResult } from './shared';

import { nextSeat, removeCards, withHandCounts } from '../../shared';
import { isLegalLead, setBeatsSet } from '../rules';
import { resolveTrick } from './resolve-trick';
import { fail } from './shared';

export function playCards(
  state: BurkozelState,
  userId: string,
  seat: number,
  cards: readonly Card[]
): BurkozelReduceResult {
  const hand = state.hands[userId] ?? [];
  const rest = removeCards(hand, cards);

  if (!rest) {
    return fail('CARD_NOT_IN_HAND');
  }

  const isLead = state.trick.length === 0;

  if (isLead) {
    if (!isLegalLead(cards, state.rules)) {
      return fail('MUST_FOLLOW_SUIT');
    }
  } else {
    // A short hand answers with everything it has left rather than forfeiting.
    const required = Math.min(state.trick[0]?.cards.length ?? 0, hand.length);

    if (cards.length !== required) {
      return fail('CARD_COUNT_MISMATCH');
    }
  }

  const best = state.bestPlayIndex === null ? null : state.trick[state.bestPlayIndex];
  const doesBeat =
    !isLead &&
    best !== undefined &&
    best !== null &&
    cards.length === best.cards.length &&
    setBeatsSet(cards, best.cards, state.trump, state.rules);

  // Only a play that takes the lead is shown; the rest stay face down until the trick ends.
  const hands: Record<string, Card[]> = { ...state.hands, [userId]: rest };
  const trick = [...state.trick, { seat, cards: [...cards], isFaceUp: isLead || doesBeat }];
  const bestPlayIndex = isLead || doesBeat ? trick.length - 1 : state.bestPlayIndex;

  const played: BurkozelState = {
    ...state,
    hands,
    players: withHandCounts(state.players, hands),
    trick,
    bestPlayIndex
  };

  if (trick.length === state.players.length) {
    return { ok: true, state: resolveTrick(played, hands) };
  }

  return {
    ok: true,
    state: {
      ...played,
      activeSeat: nextSeat(state.players, seat),
      turnDeadline: null,
      version: state.version + 1
    }
  };
}
