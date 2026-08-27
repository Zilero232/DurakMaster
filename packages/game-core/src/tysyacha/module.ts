import type { TysyachaState } from '@durak-master/schemas';

import { PLAYER_RANGE_BY_GAME } from '@durak-master/schemas';

import type { GameModule } from '../module';

import { decideBotAction, decideTimeoutAction } from './bot';
import { reduce } from './reduce';
import { createGame, startNextDeal } from './setup';
import { toPlayerView } from './view';

export const tysyachaModule: GameModule<'tysyacha'> = {
  id: 'tysyacha',
  minPlayers: PLAYER_RANGE_BY_GAME.tysyacha.min,
  maxPlayers: PLAYER_RANGE_BY_GAME.tysyacha.max,

  createGame,
  reduce,
  toPlayerView,
  decideBotAction,
  decideTimeoutAction,

  startNextDeal: (state: TysyachaState, randomInt) =>
    state.stage === 'scoring' && state.phase === 'playing' ? startNextDeal(state, randomInt) : null
};
