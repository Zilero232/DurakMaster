import type { DurakRules, DurakState } from '@durak-master/schemas';

import { DEFAULT_DURAK_RULES, maxDurakPlayers } from '@durak-master/schemas';
import { describe, expect, it } from 'vitest';

import { decideBotAction } from '../bot';
import { reduce } from '../reduce';
import { createGame } from '../setup';

const STEP_LIMIT = 40_000;

const SEEDS = 4;

const DECK_SIZES = [24, 36, 52] as const;
const MODES = ['throwIn', 'transfer'] as const;
const SCOPES = ['neighbors', 'all'] as const;

const createRandomInt = (seed: number): ((maxExclusive: number) => number) => {
  let value = seed;

  return (maxExclusive: number): number => {
    value = (value * 1_103_515_245 + 12_345) % 2_147_483_647;

    return value % maxExclusive;
  };
};

const playOut = (rules: DurakRules, players: number, seed: number): DurakState => {
  const randomInt = createRandomInt(seed);

  let state = createGame({
    tableId: 'table',
    settings: {
      game: 'durak',
      bet: 0,
      maxPlayers: players,
      isPrivate: false,
      speed: 'normal',
      turnTimeoutSeconds: 30,
      rules
    },
    userIds: Array.from({ length: players }, (_, index) => `p${index}`),
    randomInt
  });

  for (let step = 0; step < STEP_LIMIT && state.phase !== 'finished'; step += 1) {
    const actor = state.players.find((player) => player.seat === state.activeSeat);

    if (!actor) {
      break;
    }

    const action = decideBotAction(state, actor.userId);

    if (!action) {
      break;
    }

    const result = reduce(state, actor.userId, action);

    if (!result.ok) {
      break;
    }

    state = result.state;
  }

  return state;
};

const combinations = DECK_SIZES.flatMap((deckSize) =>
  MODES.flatMap((mode) =>
    SCOPES.flatMap((throwInScope) =>
      [true, false].flatMap((allowDraw) =>
        [true, false].map((withJokers) => ({
          deckSize,
          mode,
          throwInScope,
          allowDraw,
          withJokers
        }))
      )
    )
  )
);

describe('durak rule matrix', () => {
  it.each(combinations)(
    'finishes with deck $deckSize, $mode, throw-in $throwInScope, draw $allowDraw, jokers $withJokers',
    ({ deckSize, mode, throwInScope, allowDraw, withJokers }) => {
      const rules: DurakRules = {
        ...DEFAULT_DURAK_RULES,
        deckSize,
        mode,
        throwInScope,
        allowDraw,
        withJokers
      };

      const seats = Math.min(4, maxDurakPlayers(deckSize));

      for (let seed = 1; seed <= SEEDS; seed += 1) {
        const finished = playOut(rules, seats, seed);

        expect(
          finished.phase,
          `deck ${deckSize} / ${mode} / ${throwInScope} / draw ${allowDraw} stalled on seed ${seed}`
        ).toBe('finished');

        const hasOutcome = finished.isDraw || finished.loserUserId !== null;

        expect(hasOutcome, 'a finished deal must name a loser or be a draw').toBe(true);
      }
    }
  );
});
