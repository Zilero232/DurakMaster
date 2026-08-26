import type { ReactNode } from 'react';
import type { StyleProp, ViewStyle } from 'react-native';

export type ContentWidthProps = {
  children: ReactNode;

  maxWidth?: number;
  style?: StyleProp<ViewStyle>;
};
