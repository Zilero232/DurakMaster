import type { Suit } from '@durak-master/schemas';

export type RailItemProps = {
  label: string;
  suit: Suit;
  isActive: boolean;
  testID?: string;
  onPress: () => void;
};
