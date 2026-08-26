import type { GameAction, GameState } from '@durak-master/schemas';

import { beats } from './deck';
import { hasUndefendedCards } from './rules';

export function decideTimeoutAction(state: GameState, userId: string): GameAction {
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

export function canDefendAnything(state: GameState, userId: string): boolean {
  const hand = state.hands[userId] ?? [];

  return state.table.some(
    (pair) => pair.defense === null && hand.some((card) => beats(card, pair.attack, state.trump))
  );
}
