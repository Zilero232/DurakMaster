import type { BoostId } from '@durak-master/schemas';

export type BoostBarProps = {
  boosts: readonly BoostId[];
  coins: number;
  unavailable?: ReadonlySet<BoostId>;
  onSelectBoost: (boost: BoostId) => void;
};
