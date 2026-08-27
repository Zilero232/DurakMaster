import type { DurakState } from '@durak-master/schemas';

import { describe, expect, it } from 'bun:test';

import { createGame } from '../setup';
import { reduce } from './index';

const DEFAULT_RULES = {
  mode: 'throwIn' as const,
  deckSize: 36 as const,
  throwInScope: 'neighbors' as const,
  fairness: 'fair' as const,
  allowDraw: true,
  firstMove: 'lowestTrump' as const,
  allowTransferByShowingTrump: false,
  attackLimit: 6
};

const createTwoPlayerGame = (): DurakState =>
  createGame({
    tableId: 'table',
    settings: {
      game: 'durak',
      bet: 0,
      maxPlayers: 2,
      isPrivate: false,
      speed: 'normal',
      turnTimeoutSeconds: 30,
      rules: DEFAULT_RULES
    },
    userIds: ['a', 'b'],
    randomInt: (max) => max - 1
  });

describe('durak pass', () => {
  it('closes the bout when the attacker passes on a fully defended table', () => {
    const initial = createTwoPlayerGame();

    const attacker = initial.players[initial.attackerSeat]?.userId ?? '';
    const defender = initial.players[initial.defenderSeat]?.userId ?? '';

    const [attackCard] = initial.hands[attacker] ?? [];

    expect(attackCard).toBeDefined();

    if (!attackCard) {
      return;
    }
    const attacked = reduce(initial, attacker, { type: 'attack', card: attackCard });

    expect(attacked.ok).toBe(true);

    if (!attacked.ok) {
      return;
    }

    const beating = (attacked.state.hands[defender] ?? []).find(
      (card) =>
        (card.suit === attackCard.suit && card.rank !== attackCard.rank) ||
        card.suit === attacked.state.trump
    );

    expect(beating).toBeDefined();

    if (!beating) {
      return;
    }

    const defended = reduce(attacked.state, defender, {
      type: 'defend',
      pairIndex: 0,
      card: beating
    });

    expect(defended.ok).toBe(true);

    if (!defended.ok) {
      return;
    }

    expect(defended.state.table[0]?.defense).toBeDefined();

    // Who played each card decides which side of the table it flies in from.
    expect(attacked.state.table[0]?.attackSeat).toBe(initial.attackerSeat);
    expect(defended.state.table[0]?.defenseSeat).toBe(initial.defenderSeat);

    const passed = reduce(defended.state, attacker, { type: 'pass' });

    expect(passed.ok).toBe(true);

    if (!passed.ok) {
      return;
    }

    expect(passed.state.table).toHaveLength(0);
    expect(passed.state.attackerSeat).toBe(initial.defenderSeat);
  });
});
