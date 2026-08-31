import { LinearGradient } from 'expo-linear-gradient';
import { View } from 'react-native';

import type { PanelProps } from './Panel.types';

import { gradientEnds } from '../../theme';
import { ELEVATION_STYLES, PADDING_STYLES, styles, TONE_GRADIENT } from './Panel.styles';

export const Panel = ({
  children,
  tone = 'raised',
  elevation = 'lifted',
  padding = 'default',
  isHighlighted = false,
  style
}: PanelProps) => (
  <LinearGradient
    style={[
      styles.root,
      PADDING_STYLES[padding],
      ELEVATION_STYLES[elevation],
      isHighlighted && styles.highlighted,
      style
    ]}
    colors={TONE_GRADIENT[tone]}
    end={gradientEnds.vertical.end}
    start={gradientEnds.vertical.start}
  >
    <View pointerEvents='none' style={styles.sheen} />

    {children}
  </LinearGradient>
);
