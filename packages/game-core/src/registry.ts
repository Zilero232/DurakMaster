import type { GameId } from '@durak-master/schemas';

import { GAME_IDS } from '@durak-master/schemas';

import type { GameModule } from './module';

import { burkozelModule } from './burkozel';
import { durakModule } from './durak';
import { kozelModule } from './kozel';
import { tysyachaModule } from './tysyacha';

type Registry = {
  [G in GameId]: GameModule<G>;
};

const REGISTRY: Registry = {
  burkozel: burkozelModule,
  durak: durakModule,
  kozel: kozelModule,
  tysyacha: tysyachaModule
};

export const getGameModule = <G extends GameId>(game: G): GameModule<G> => REGISTRY[game];

export const implementedGames = (): GameId[] => [...GAME_IDS];
