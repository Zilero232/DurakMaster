import type { KozelState } from '@durak-master/schemas';

import type { GameModule } from '../module';

import { decideBotAction, decideTimeoutAction } from './bot';
import { reduce } from './reduce';
import { createGame, startNextDeal } from './setup';
import { toPlayerView } from './view';

export const kozelModule: GameModule<'kozel'> = {
  id: 'kozel',
  minPlayers: 4,
  maxPlayers: 4,

  createGame,
  reduce,
  toPlayerView,
  decideBotAction,
  decideTimeoutAction,

  startNextDeal: (state: KozelState, randomInt) =>
    state.isDealComplete ? startNextDeal({ state, randomInt }) : null
};
