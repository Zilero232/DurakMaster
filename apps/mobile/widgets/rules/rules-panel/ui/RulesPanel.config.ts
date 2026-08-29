import type { GameId } from '@durak-master/schemas';

export const RULE_SECTIONS: Partial<Record<GameId, readonly string[]>> = {
  durak: ['deal', 'firstMove', 'defend', 'throwIn', 'endBout', 'draw', 'end']
};
