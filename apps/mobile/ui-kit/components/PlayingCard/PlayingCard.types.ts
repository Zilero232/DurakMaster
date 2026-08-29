import type { Card } from '@durak-master/schemas';
import type { StyleProp, ViewStyle } from 'react-native';

import type { CardTheme } from '../../theme';

export type PlayingCardProps = {
  card: Card | null;
  isPlayable?: boolean;

  /** Draws the accent ring — the move-hint setting decides whether the caller sets it. */
  hasHint?: boolean;
  isSelected?: boolean;
  rotation?: number;
  width?: number;
  theme?: CardTheme;
  style?: StyleProp<ViewStyle>;
  onPress?: () => void;
};
