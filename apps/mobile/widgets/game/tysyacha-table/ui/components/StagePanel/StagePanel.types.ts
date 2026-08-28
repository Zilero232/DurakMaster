import type { TysyachaPhase } from '@durak-master/schemas';

export type StagePanelProps = {
  stage: TysyachaPhase;
  contract: number | null;
  isMyTurn: boolean;
  isDeclarer: boolean;
  nextBid: number;
  onBid: (value: number) => void;
  onPass: () => void;
};
