import { LinearGradient } from 'expo-linear-gradient';
import { View } from 'react-native';
import Svg, { Defs, Path, Pattern, RadialGradient, Rect, Stop } from 'react-native-svg';

import type { FeltBackgroundProps } from './FeltBackground.types';

import { colors } from '../../theme';
import {
  GLOW_CENTER,
  GLOW_OPACITY,
  GLOW_RADIUS,
  WEAVE_OPACITY,
  WEAVE_STEP
} from './FeltBackground.config';
import { styles } from './FeltBackground.styles';

export const FeltBackground = ({ children, style }: FeltBackgroundProps) => (
  <LinearGradient
    colors={[colors.feltCore, colors.feltMid, colors.feltDeep]}
    end={{ x: 0.5, y: 1 }}
    locations={[0, 0.55, 1]}
    start={{ x: 0.5, y: 0 }}
    style={[styles.root, style]}
  >
    <View pointerEvents='none' style={styles.layer}>
      <Svg height='100%' width='100%'>
        <Defs>
          <RadialGradient cx={GLOW_CENTER.x} cy={GLOW_CENTER.y} id='felt-glow' r={GLOW_RADIUS}>
            <Stop offset='0' stopColor={colors.feltGlow} stopOpacity={GLOW_OPACITY} />
            <Stop offset='0.6' stopColor={colors.feltGlow} stopOpacity={GLOW_OPACITY * 0.25} />
            <Stop offset='1' stopColor={colors.feltEdge} stopOpacity='0.55' />
          </RadialGradient>

          <Pattern
            height={WEAVE_STEP}
            id='felt-weave'
            patternUnits='userSpaceOnUse'
            width={WEAVE_STEP}
          >
            <Path
              d={`M0 ${WEAVE_STEP} L${WEAVE_STEP} 0`}
              stroke={colors.feltWeave}
              strokeOpacity={WEAVE_OPACITY}
              strokeWidth='1'
            />
          </Pattern>
        </Defs>

        <Rect fill='url(#felt-glow)' height='100%' width='100%' />
        <Rect fill='url(#felt-weave)' height='100%' width='100%' />
      </Svg>
    </View>

    {children}
  </LinearGradient>
);
