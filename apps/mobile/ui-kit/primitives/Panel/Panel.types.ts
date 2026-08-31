import type { ReactNode } from 'react';
import type { StyleProp, ViewStyle } from 'react-native';

export type PanelTone = 'plain' | 'raised' | 'sunken';
export type PanelElevation = 'flat' | 'floating' | 'lifted';
export type PanelPadding = 'compact' | 'default' | 'none' | 'roomy';

export type PanelProps = {
  children: ReactNode;

  /** Gradient fill: `raised` lifts off the background, `sunken` reads as a well. */
  tone?: PanelTone;

  /** Drop shadow depth. */
  elevation?: PanelElevation;

  /** Inner spacing; `none` lets the children run to the edges. */
  padding?: PanelPadding;

  /** Gold frame for the surface that owns the screen's attention. */
  isHighlighted?: boolean;

  style?: StyleProp<ViewStyle>;
};
