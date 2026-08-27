import type { BurkozelState } from '@durak-master/schemas';

import { PLAYER_RANGE_BY_GAME } from '@durak-master/schemas';

import type { GameModule } from '../module';

import { decideBotAction, decideTimeoutAction } from './bot';
import { reduce } from './reduce';
import { createGame, startNextDeal } from './setup';
import { toPlayerView } from './view';

export const burkozelModule: GameModule<'burkozel'> = {
  id: 'burkozel',
  minPlayers: PLAYER_RANGE_BY_GAME.burkozel.min,
  maxPlayers: PLAYER_RANGE_BY_GAME.burkozel.max,

  createGame,
  reduce,
  toPlayerView,
  decideBotAction,
  decideTimeoutAction,

  startNextDeal: (state: BurkozelState, randomInt) =>
    state.isDealComplete && state.phase === 'playing' ? startNextDeal(state, randomInt) : null
};
