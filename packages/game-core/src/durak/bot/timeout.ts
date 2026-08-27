import type { DurakAction, DurakState } from '@durak-master/schemas';

import { hasUndefendedCards } from '../rules';

export function decideTimeoutAction(state: DurakState, userId: string): DurakAction {
  const seat = state.players.find((player) => player.userId === userId)?.seat;

  if (seat === undefined || seat !== state.defenderSeat || !hasUndefendedCards(state.table)) {
    return { type: 'pass' };
  }

  return { type: 'take' };
}
