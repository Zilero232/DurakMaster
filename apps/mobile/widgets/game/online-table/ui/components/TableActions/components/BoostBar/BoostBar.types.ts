import type { BoostId } from '@durak-master/schemas';

export type BoostBarProps = {
  coins: number;
  hasLeaveButton: boolean;
  onUseBoost: (boost: BoostId) => void;
  onLeave: () => void;
};
