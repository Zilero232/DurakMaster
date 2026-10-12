import type { FinishReason } from '@durak-master/schemas';

export type MatchResultProps = {
  isLoser: boolean;
  reason: FinishReason;
  isDraw: boolean;
  creditsDelta: number;
  ratingDelta: number;
  onToMenu: () => void;
};
