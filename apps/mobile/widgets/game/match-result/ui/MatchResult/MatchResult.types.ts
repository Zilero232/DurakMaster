import type { FinishReason } from '@durak-master/schemas';

export type MatchResultProps = {
  isLoser: boolean;
  reason: FinishReason;
  isDraw: boolean;
  creditsDelta: number;
  ratingDelta: number;

  /** Still seated at the table, so the next deal can start without leaving it. */
  canRematch: boolean;
  onRematch: () => void;
  onToMenu: () => void;
};
