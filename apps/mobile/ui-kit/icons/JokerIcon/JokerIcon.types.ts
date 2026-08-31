import type { StyleProp, ViewStyle } from 'react-native';

export type JokerIconProps = {
  size?: number;

  /** Ink colour for the whole mark; defaults to the card foreground. */
  color?: string;
  style?: StyleProp<ViewStyle>;
};
