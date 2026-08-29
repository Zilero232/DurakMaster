import type { GameId } from '@durak-master/schemas';

import { GAME_IDS } from '@durak-master/schemas';

import type { GameModule } from './module';

import { durakModule } from './durak';

type Registry = {
  [G in GameId]: GameModule<G>;
};

const REGISTRY: Registry = {
  durak: durakModule
};

export const getGameModule = <G extends GameId>(game: G): GameModule<G> => REGISTRY[game];

export const implementedGames = (): GameId[] => [...GAME_IDS];
