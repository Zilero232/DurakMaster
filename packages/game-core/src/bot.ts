import type { Card, GameAction, GameState } from '@durak-master/schemas';

import { beats, rankValue } from './deck';
import { isLegalAttackCard } from './rules';

function cardCost(card: Card, trump: GameState['trump']): number {
  return rankValue(card.rank) + (card.suit === trump ? 100 : 0);
}

export function decideBotAction(state: GameState, userId: string): GameAction {
  const hand = state.hands[userId] ?? [];
  const seat = state.players.find((player) => player.userId === userId)?.seat ?? -1;
  const isDefender = seat === state.defenderSeat;

  if (isDefender) {
    return decideDefense(state, hand);
  }

  return decideAttack(state, hand);
}

function decideDefense(state: GameState, hand: Card[]): GameAction {
  const targetIndex = state.table.findIndex((pair) => pair.defense === null);

  if (targetIndex === -1) {
    return { type: 'pass' };
  }

  const target = state.table[targetIndex];

  if (!target) {
    return { type: 'take' };
  }

  const options = hand
    .filter((card) => beats(card, target.attack, state.trump))
    .sort((a, b) => cardCost(a, state.trump) - cardCost(b, state.trump));

  const choice = options[0];

  if (!choice) {
    return { type: 'take' };
  }

  return { type: 'defend', pairIndex: targetIndex, card: choice };
}

function decideAttack(state: GameState, hand: Card[]): GameAction {
  const options = hand
    .filter((card) => isLegalAttackCard(card, state.table, state.attackLimit))
    .sort((a, b) => cardCost(a, state.trump) - cardCost(b, state.trump));

  const choice = options[0];

  if (!choice) {
    return { type: 'pass' };
  }

  if (state.table.length > 0 && choice.suit === state.trump) {
    return { type: 'pass' };
  }

  return { type: 'attack', card: choice };
}
