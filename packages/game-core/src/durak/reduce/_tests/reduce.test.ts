import type { DurakState } from '@durak-master/schemas';

import { describe, expect, it } from 'vitest';

import { decideBotAction } from '../../bot';
import { createGame } from '../../setup';
import { reduce } from '../index';

const DEFAULT_RULES = {
  mode: 'throwIn' as const,
  deckSize: 36 as const,
  throwInScope: 'neighbors' as const,
  fairness: 'fair' as const,
  allowDraw: true,
  firstMove: 'lowestTrump' as const,
  allowTransferByShowingTrump: false,
  withJokers: false,
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

describe('durak talon', () => {
  it('keeps the turned-up trump as the last card anyone draws', () => {
    const state = createTwoPlayerGame();

    expect(state.trumpCard).not.toBeNull();

    expect(state.talon.at(-1)).toEqual(state.trumpCard ?? undefined);
  });
});

const createGameFor = (players: number, seed: number): DurakState => {
  let rng = seed;

  const randomInt = (max: number): number => {
    rng = (rng * 1_103_515_245 + 12_345) % 2_147_483_647;

    return rng % max;
  };

  return createGame({
    tableId: 'table',
    settings: {
      game: 'durak',
      bet: 0,
      maxPlayers: players,
      isPrivate: false,
      speed: 'normal',
      turnTimeoutSeconds: 30,
      rules: DEFAULT_RULES
    },
    userIds: Array.from({ length: players }, (_, index) => `p${index}`),
    randomInt
  });
};

describe('durak self-play', () => {
  it('always reaches a finish, so a table of bots can never stall', () => {
    for (const players of [2, 3, 4, 5, 6]) {
      for (let seed = 1; seed <= 25; seed += 1) {
        let state = createGameFor(players, seed);

        const userIds = state.players.map((player) => player.userId);

        let steps = 0;

        while (state.phase !== 'finished' && steps < 3000) {
          const mover = userIds.find(
            (userId) => reduce(state, userId, decideBotAction(state, userId)).ok
          );

          expect(mover).toBeDefined();

          if (!mover) {
            return;
          }

          const result = reduce(state, mover, decideBotAction(state, mover));

          expect(result.ok).toBe(true);

          if (!result.ok) {
            return;
          }

          expect(result.state.version).toBeGreaterThan(state.version);

          state = result.state;
          steps += 1;
        }

        expect(state.phase).toBe('finished');
      }
    }
  });
});

describe('durak bout', () => {
  it('lets only the main attacker open a bout', () => {
    const base = createGameFor(4, 7);
    const state: DurakState = { ...base, rules: { ...base.rules, throwInScope: 'all' } };

    const thrower = state.players.find(
      (player) => player.seat !== state.attackerSeat && player.seat !== state.defenderSeat
    );

    expect(thrower).toBeDefined();

    if (!thrower) {
      return;
    }

    const [card] = state.hands[thrower.userId] ?? [];

    expect(card).toBeDefined();

    if (!card) {
      return;
    }

    expect(state.table).toHaveLength(0);
    expect(reduce(state, thrower.userId, { type: 'attack', card }).ok).toBe(false);

    const [opener] = state.hands[state.players[state.attackerSeat]?.userId ?? ''] ?? [];

    expect(opener).toBeDefined();

    if (!opener) {
      return;
    }

    const opened = reduce(state, state.players[state.attackerSeat]?.userId ?? '', {
      type: 'attack',
      card: opener
    });

    expect(opened.ok).toBe(true);

    if (!opened.ok) {
      return;
    }

    const joining = (opened.state.hands[thrower.userId] ?? []).find(
      (item) => item.rank === opener.rank
    );

    if (joining) {
      expect(reduce(opened.state, thrower.userId, { type: 'attack', card: joining }).ok).toBe(true);
    }
  });

  it('refuses a second pass from the same seat', () => {
    const initial = createGameFor(4, 7);

    const attacker = initial.players[initial.attackerSeat]?.userId ?? '';
    const [card] = initial.hands[attacker] ?? [];

    expect(card).toBeDefined();

    if (!card) {
      return;
    }

    const attacked = reduce(initial, attacker, { type: 'attack', card });

    expect(attacked.ok).toBe(true);

    if (!attacked.ok) {
      return;
    }

    const passed = reduce(attacked.state, attacker, { type: 'pass' });

    expect(passed.ok).toBe(true);

    if (!passed.ok) {
      return;
    }

    expect(reduce(passed.state, attacker, { type: 'pass' }).ok).toBe(false);
  });

  it('refuses a second take from the defender', () => {
    const initial = createGameFor(4, 7);

    const attacker = initial.players[initial.attackerSeat]?.userId ?? '';
    const defender = initial.players[initial.defenderSeat]?.userId ?? '';
    const [card] = initial.hands[attacker] ?? [];

    expect(card).toBeDefined();

    if (!card) {
      return;
    }

    const attacked = reduce(initial, attacker, { type: 'attack', card });

    expect(attacked.ok).toBe(true);

    if (!attacked.ok) {
      return;
    }

    const took = reduce(attacked.state, defender, { type: 'take' });

    expect(took.ok).toBe(true);

    if (!took.ok) {
      return;
    }

    expect(reduce(took.state, defender, { type: 'take' }).ok).toBe(false);
  });
});
