import { LinearGradient } from 'expo-linear-gradient';

import type { FeltBackgroundProps } from './FeltBackground.types';

import { colors } from '../../theme';
import { styles } from './FeltBackground.styles';

export const FeltBackground = ({ children, style }: FeltBackgroundProps) => (
  <LinearGradient
    colors={[colors.feltCore, colors.feltMid, colors.feltDeep]}
    end={{ x: 0.5, y: 1 }}
    locations={[0, 0.55, 1]}
    start={{ x: 0.5, y: 0 }}
    style={[styles.root, style]}
  >
    <LinearGradient
      colors={[colors.feltEdge, colors.transparent, colors.transparent, colors.feltEdge]}
      end={{ x: 1, y: 0.5 }}
      locations={[0, 0.25, 0.75, 1]}
      start={{ x: 0, y: 0.5 }}
      style={styles.vignette}
    />

    {children}
  </LinearGradient>
);
