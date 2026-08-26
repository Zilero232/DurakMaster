import type { Suit } from '@durak-master/schemas';
import type { StyleProp, ViewStyle } from 'react-native';

export type SuitIconProps = {
  suit: Suit;
  size?: number;
  color?: string;
  style?: StyleProp<ViewStyle>;
};
