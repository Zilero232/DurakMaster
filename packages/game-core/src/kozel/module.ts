import type { KozelState } from '@durak-master/schemas';

import { PLAYER_RANGE_BY_GAME } from '@durak-master/schemas';

import type { GameModule } from '../module';

import { decideBotAction, decideTimeoutAction } from './bot';
import { reduce } from './reduce';
import { createGame, startNextDeal } from './setup';
import { toPlayerView } from './view';

export const kozelModule: GameModule<'kozel'> = {
  id: 'kozel',
  minPlayers: PLAYER_RANGE_BY_GAME.kozel.min,
  maxPlayers: PLAYER_RANGE_BY_GAME.kozel.max,

  createGame,
  reduce,
  toPlayerView,
  decideBotAction,
  decideTimeoutAction,

  startNextDeal: (state: KozelState, randomInt) =>
    state.isDealComplete ? startNextDeal({ state, randomInt }) : null
};
