import type { ReactNode } from 'react';
import type { StyleProp, ViewStyle } from 'react-native';

export type LobbyBackgroundProps = {
  children?: ReactNode;
  style?: StyleProp<ViewStyle>;

  /** Battery saver pins the drifting suits in place. */
  isStatic?: boolean;
};
