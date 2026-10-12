import type { BoostId } from '@durak-master/schemas';

export type BoostButtonProps = {
  boost: BoostId;
  price: number;

  /** Still opens its confirm, which explains why it cannot be used right now. */
  isDimmed?: boolean;
  onPress: (boost: BoostId) => void;
};
