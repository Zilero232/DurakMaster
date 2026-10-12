import type { ReactNode } from 'react';
import type { StyleProp, ViewStyle } from 'react-native';

export type PopInMotion = 'drop' | 'rise' | 'zoom';

export type PopInProps = {
  children: ReactNode;
  motion: PopInMotion;
  delayMs: number;
  style?: StyleProp<ViewStyle>;
};
