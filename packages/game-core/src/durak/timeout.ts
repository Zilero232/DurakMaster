import type { DurakAction, DurakState } from '@durak-master/schemas';

import { beats, hasUndefendedCards } from './rules';

export function decideTimeoutAction(state: DurakState, userId: string): DurakAction {
  const seat = state.players.find((player) => player.userId === userId)?.seat;

  if (seat === undefined) {
    return { type: 'pass' };
  }

  if (seat !== state.defenderSeat) {
    return { type: 'pass' };
  }

  if (!hasUndefendedCards(state.table)) {
    return { type: 'pass' };
  }

  return { type: 'take' };
}

export function canDefendAnything(state: DurakState, userId: string): boolean {
  const hand = state.hands[userId] ?? [];

  return state.table.some(
    (pair) => pair.defense === null && hand.some((card) => beats(card, pair.attack, state.trump))
  );
}
