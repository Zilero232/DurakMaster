import type { GameCoreState, GameId } from '@durak-master/schemas';

import { DEFAULT_TABLE_SETTINGS, GAME_IDS, PLAYER_RANGE_BY_GAME } from '@durak-master/schemas';
import { describe, expect, it } from 'vitest';

import { getGameModule } from '../registry';

const STEP_LIMIT = 60_000;

const SEEDS = 12;

const createRandomInt = (seed: number): ((maxExclusive: number) => number) => {
  let value = seed;

  return (maxExclusive: number): number => {
    value = (value * 1_103_515_245 + 12_345) % 2_147_483_647;

    return value % maxExclusive;
  };
};

type PlayResult = {
  isFinished: boolean;
  steps: number;
  stalledAt: GameCoreState | null;
};

const playOut = (game: GameId, players: number, seed: number): PlayResult => {
  const module = getGameModule(game);
  const randomInt = createRandomInt(seed);
  const userIds = Array.from({ length: players }, (_, index) => `p${index}`);

  let state = module.createGame({
    tableId: 'table',
    settings: { ...DEFAULT_TABLE_SETTINGS[game], maxPlayers: players } as never,
    userIds,
    randomInt
  });

  for (let steps = 0; steps < STEP_LIMIT; steps += 1) {
    if (state.phase === 'finished') {
      return { isFinished: true, steps, stalledAt: null };
    }

    const version = state.version;

    const mover = userIds.find(
      (userId) => module.reduce(state, userId, module.decideBotAction(state, userId)).ok
    );

    if (!mover) {
      return { isFinished: false, steps, stalledAt: state };
    }

    const result = module.reduce(state, mover, module.decideBotAction(state, mover));

    if (!result.ok) {
      return { isFinished: false, steps, stalledAt: state };
    }

    state = result.state;

    if (state.version === version) {
      return { isFinished: false, steps, stalledAt: state };
    }

    const dealt = module.startNextDeal?.(state, randomInt);

    if (dealt) {
      state = dealt;
    }
  }

  return { isFinished: false, steps: STEP_LIMIT, stalledAt: state };
};

describe.each(GAME_IDS)('%s self-play', (game) => {
  const { min, max } = PLAYER_RANGE_BY_GAME[game];

  const seatCounts = Array.from({ length: max - min + 1 }, (_, index) => min + index);

  it.each(seatCounts)('always reaches a finish with %i players', (players) => {
    for (let seed = 1; seed <= SEEDS; seed += 1) {
      const result = playOut(game, players, seed);

      expect(
        result.isFinished,
        `${game} with ${players} players stalled on seed ${seed} after ${result.steps} steps`
      ).toBe(true);
    }
  });
});

describe.each(GAME_IDS)('%s timeouts', (game) => {
  const { min, max } = PLAYER_RANGE_BY_GAME[game];

  const seatCounts = Array.from({ length: max - min + 1 }, (_, index) => min + index);

  it.each(seatCounts)('are always playable with %i players', (players) => {
    const module = getGameModule(game);

    for (let seed = 1; seed <= 6; seed += 1) {
      const randomInt = createRandomInt(seed);
      const userIds = Array.from({ length: players }, (_, index) => `p${index}`);

      let state = module.createGame({
        tableId: 'table',
        settings: { ...DEFAULT_TABLE_SETTINGS[game], maxPlayers: players } as never,
        userIds,
        randomInt
      });

      for (let steps = 0; steps < 2_000 && state.phase !== 'finished'; steps += 1) {
        const active = state.players.find((player) => player.seat === state.activeSeat);

        if (active) {
          const timeout = module.decideTimeoutAction(state, active.userId);

          expect(
            module.reduce(state, active.userId, timeout).ok,
            `${game}/${players}p seed ${seed}: "${timeout.type}" was refused for the seat on turn`
          ).toBe(true);
        }

        const mover = userIds.find(
          (userId) => module.reduce(state, userId, module.decideBotAction(state, userId)).ok
        );

        if (!mover) {
          break;
        }

        const result = module.reduce(state, mover, module.decideBotAction(state, mover));

        if (!result.ok) {
          break;
        }

        state = result.state;

        const dealt = module.startNextDeal?.(state, randomInt);

        if (dealt) {
          state = dealt;
        }
      }
    }
  });
});
