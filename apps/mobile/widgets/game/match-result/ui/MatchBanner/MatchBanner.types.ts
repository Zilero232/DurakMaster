import type { FinishReason } from '@durak-master/schemas';

export type MatchBannerProps = {
  isLoser: boolean;
  reason: FinishReason;
  isDraw: boolean;
  creditsDelta: number;
  ratingDelta: number;
  onDone: () => void;
};
