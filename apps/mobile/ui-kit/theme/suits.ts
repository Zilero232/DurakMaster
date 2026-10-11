import type { Rank } from '@durak-master/schemas';

const RANK_LABEL: Record<Rank, string> = {
  two: '2',
  three: '3',
  four: '4',
  five: '5',
  six: '6',
  seven: '7',
  eight: '8',
  nine: '9',
  ten: '10',
  jack: 'J',
  queen: 'Q',
  king: 'K',
  ace: 'A'
};

export const rankLabel = (rank: Rank): string => RANK_LABEL[rank];
