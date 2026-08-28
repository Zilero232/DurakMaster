import type { DurakAction, DurakState } from '@durak-master/schemas';

import { hasUndefendedCards, isLegalAttackCard } from '../rules';

export function decideTimeoutAction(state: DurakState, userId: string): DurakAction {
  const seat = state.players.find((player) => player.userId === userId)?.seat;

  if (seat === undefined) {
    return { type: 'pass' };
  }

  if (seat === state.defenderSeat) {
    if (state.isTaking) {
      return { type: 'pass' };
    }

    return hasUndefendedCards(state.table) ? { type: 'take' } : { type: 'pass' };
  }

  if (state.table.length === 0) {
    const card = (state.hands[userId] ?? []).find((item) =>
      isLegalAttackCard(item, state.table, state.attackLimit)
    );

    return card ? { type: 'attack', card } : { type: 'pass' };
  }

  return { type: 'pass' };
}
