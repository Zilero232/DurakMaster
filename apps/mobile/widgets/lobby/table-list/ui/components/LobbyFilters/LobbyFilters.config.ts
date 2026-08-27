import { implementedGames } from '@durak-master/game-core';

import type { BetFilter, GameFilter } from '../../../model';

export const GAME_OPTIONS: GameFilter[] = ['all', ...implementedGames()];

export const BET_OPTIONS: BetFilter[] = ['all', 'low', 'mid', 'high'];
