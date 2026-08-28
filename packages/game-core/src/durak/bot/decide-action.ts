import type { Card, DurakAction, DurakState, Suit } from '@durak-master/schemas';

import { beats, isLegalAttackCard, rankValue } from '../rules';

const TRUMP_PENALTY = 100;

const TRUMP_WASTE_LIMIT = 2;

const ENDGAME_TALON = 4;

function cardCost(card: Card, trump: Suit): number {
  return rankValue(card.rank) + (card.suit === trump ? TRUMP_PENALTY : 0);
}

function isWorthDefending(state: DurakState, attack: Card, defense: Card): boolean {
  const isTrumpDefense = defense.suit === state.trump;
  const isTrumpAttack = attack.suit === state.trump;

  if (!isTrumpDefense || isTrumpAttack) {
    return true;
  }

  if (state.talon.length <= ENDGAME_TALON) {
    return true;
  }

  return rankValue(defense.rank) - rankValue(attack.rank) <= TRUMP_WASTE_LIMIT;
}

function decideDefense(state: DurakState, hand: Card[]): DurakAction {
  if (state.isTaking) {
    return { type: 'pass' };
  }

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

  if (!choice || !isWorthDefending(state, target.attack, choice)) {
    return { type: 'take' };
  }

  return { type: 'defend', pairIndex: targetIndex, card: choice };
}

function isTrumpWorthThrowingIn(state: DurakState, card: Card): boolean {
  if (card.suit !== state.trump) {
    return true;
  }

  const isOpeningTheBout = state.table.length === 0;
  const isEndgame = state.talon.length <= ENDGAME_TALON;

  return isOpeningTheBout || isEndgame;
}

function decideAttack(state: DurakState, hand: Card[]): DurakAction {
  const options = hand
    .filter((card) => isLegalAttackCard(card, state.table, state.attackLimit))
    .sort((a, b) => cardCost(a, state.trump) - cardCost(b, state.trump));

  const choice = options[0];

  if (!choice) {
    return { type: 'pass' };
  }

  if (!isTrumpWorthThrowingIn(state, choice)) {
    return { type: 'pass' };
  }

  return { type: 'attack', card: choice };
}

export function decideBotAction(state: DurakState, userId: string): DurakAction {
  const hand = state.hands[userId] ?? [];
  const seat = state.players.find((player) => player.userId === userId)?.seat ?? -1;
  const isDefender = seat === state.defenderSeat;

  if (isDefender) {
    return decideDefense(state, hand);
  }

  return decideAttack(state, hand);
}
