import type { GameId } from '@durak-master/schemas';

import type { GameModule } from './module';

import { burkozelModule } from './burkozel/module';
import { durakModule } from './durak/module';
import { kozelModule } from './kozel/module';

type Registry = {
  [G in GameId]?: GameModule<G>;
};

const REGISTRY: Registry = {
  burkozel: burkozelModule,
  durak: durakModule,
  kozel: kozelModule
};

export const getGameModule = <G extends GameId>(game: G): GameModule<G> => {
  const module = REGISTRY[game];

  if (!module) {
    throw new Error(`Game "${game}" is not implemented yet`);
  }

  return module;
};

export const isGameImplemented = (game: GameId): boolean => REGISTRY[game] !== undefined;

export const implementedGames = (): GameId[] => Object.keys(REGISTRY) as GameId[];
