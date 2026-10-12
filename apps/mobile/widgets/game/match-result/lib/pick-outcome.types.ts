import type { FinishReason } from '@durak-master/schemas';

export type PickOutcomeInput = {
  isDraw: boolean;
  isLoser: boolean;
  reason: FinishReason;
};
