import type { GameId } from '@durak-master/schemas';

export const RULE_SECTIONS: Partial<Record<GameId, readonly string[]>> = {
  durak: ['deal', 'firstMove', 'defend', 'throwIn', 'endBout', 'draw', 'end'],
  kozel: ['deal', 'teams', 'trump', 'order', 'play', 'points', 'score'],
  burkozel: ['deal', 'order', 'play', 'score'],
  tysyacha: ['deal', 'bidding', 'widow', 'marriages', 'play', 'score']
};

export const DOCUMENTED_GAMES = Object.keys(RULE_SECTIONS) as GameId[];
