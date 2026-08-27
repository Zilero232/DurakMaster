import type { GameModule } from '../module';

import { decideBotAction, decideTimeoutAction } from './bot';
import { reduce } from './reduce';
import { createGame } from './setup';
import { toPlayerView } from './view';

export const burkozelModule: GameModule<'burkozel'> = {
  id: 'burkozel',
  minPlayers: 2,
  maxPlayers: 4,

  createGame,
  reduce,
  toPlayerView,
  decideBotAction,
  decideTimeoutAction
};
