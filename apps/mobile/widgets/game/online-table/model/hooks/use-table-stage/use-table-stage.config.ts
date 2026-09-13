import type { GameId } from '@durak-master/schemas';

import { GAME_IDS } from '@durak-master/schemas';

export const SUPPORTED_GAMES = new Set<GameId>(GAME_IDS);
