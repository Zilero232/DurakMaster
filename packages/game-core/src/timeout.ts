import { beats } from './deck';
import { hasUndefendedCards } from './rules';

import type { GameAction, GameState } from '@durak-master/schemas';

/**
 * Что делать за игрока, не успевшего походить.
 *
 * Правило простое и предсказуемое: защищающийся берёт, атакующий пасует.
 * Автоматически «доигрывать» за человека сильнее нельзя — это исказило бы
 * исход партии, на которую сделана ставка.
 */
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

/**
 * Может ли защищающийся вообще отбиться — нужно, чтобы не предлагать
 * «беру» тому, у кого есть законный ход, и наоборот.
 */
export function canDefendAnything(state: GameState, userId: string): boolean {
  const hand = state.hands[userId] ?? [];

  return state.table.some(
    (pair) => pair.defense === null && hand.some((card) => beats(card, pair.attack, state.trump)),
  );
}
