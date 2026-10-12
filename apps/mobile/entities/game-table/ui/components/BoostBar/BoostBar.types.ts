import type { BoostId } from '@durak-master/schemas';

export type BoostBarProps = {
  coins: number;
  unavailable?: ReadonlySet<BoostId>;
  onSelectBoost: (boost: BoostId) => void;
};
