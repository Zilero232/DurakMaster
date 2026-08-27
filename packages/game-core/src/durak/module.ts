import { PLAYER_RANGE_BY_GAME } from '@durak-master/schemas';

import type { GameModule } from '../module';

import { decideBotAction, decideTimeoutAction } from './bot';
import { reduce } from './reduce';
import { createGame } from './setup';
import { toPlayerView } from './view';

export const durakModule: GameModule<'durak'> = {
  id: 'durak',
  minPlayers: PLAYER_RANGE_BY_GAME.durak.min,
  maxPlayers: PLAYER_RANGE_BY_GAME.durak.max,

  createGame,
  reduce,
  toPlayerView,
  decideBotAction,
  decideTimeoutAction
};
