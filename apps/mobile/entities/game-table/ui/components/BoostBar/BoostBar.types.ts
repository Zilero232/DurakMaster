import type { BoostId } from '@durak-master/schemas';

export type BoostBarProps = {
  coins: number;
  unavailable?: ReadonlySet<BoostId>;
  onUseBoost: (boost: BoostId) => void;
};
