import type { BoostId } from '@durak-master/schemas';

export type BoostBarProps = {
  coins: number;
  onUseBoost: (boost: BoostId) => void;
};
