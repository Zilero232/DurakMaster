import type { BetFilter } from '../config';

import { BET_BRACKETS } from '../config';

export type MatchesBetInput = {
  bet: number;
  filter: BetFilter;
};

export const matchesBet = ({ bet, filter }: MatchesBetInput): boolean => {
  switch (filter) {
    case 'low': {
      return bet <= BET_BRACKETS.low;
    }

    case 'mid': {
      return bet > BET_BRACKETS.low && bet <= BET_BRACKETS.mid;
    }

    case 'high': {
      return bet > BET_BRACKETS.mid;
    }

    default: {
      return true;
    }
  }
};
