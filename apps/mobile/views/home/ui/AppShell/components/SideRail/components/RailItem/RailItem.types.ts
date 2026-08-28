import type { Suit } from '@durak-master/schemas';

export type RailItemProps = {
  label: string;
  suit: Suit;
  isActive: boolean;
  onPress: () => void;
};
