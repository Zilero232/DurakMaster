import type { BoostId } from '@durak-master/schemas';

export type BoostButtonProps = {
  boost: BoostId;
  price: number;

  isDisabled?: boolean;
  onPress: (boost: BoostId) => void;
};
