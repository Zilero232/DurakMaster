import { useState } from 'react';
import { View } from 'react-native';
import Svg, {
  Defs,
  Ellipse,
  LinearGradient,
  Path,
  Pattern,
  RadialGradient,
  Rect,
  Stop
} from 'react-native-svg';

import type { FeltBackgroundProps } from './FeltBackground.types';

import { colors } from '../../theme';
import {
  GLOW_OPACITY,
  RAIL_WIDTH,
  TABLE_CENTER_Y,
  TABLE_RADIUS,
  VIGNETTE_OPACITY,
  WEAVE_OPACITY,
  WEAVE_STEP
} from './FeltBackground.config';
import { styles } from './FeltBackground.styles';

export const FeltBackground = ({ children, style }: FeltBackgroundProps) => {
  const [size, setSize] = useState({ width: 0, height: 0 });

  const oval = {
    cx: size.width / 2,
    cy: size.height * TABLE_CENTER_Y,
    rx: size.width * TABLE_RADIUS.x,
    ry: size.height * TABLE_RADIUS.y
  };

  const felt = { ...oval, rx: oval.rx - RAIL_WIDTH, ry: oval.ry - RAIL_WIDTH };

  return (
    <View style={[styles.root, style]} onLayout={(event) => setSize(event.nativeEvent.layout)}>
      <View pointerEvents='none' style={styles.layer}>
        <Svg height='100%' width='100%'>
          <Defs>
            <RadialGradient cx='50%' cy='46%' id='room' r='75%'>
              <Stop offset='0' stopColor={colors.feltDeep} />
              <Stop offset='1' stopColor={colors.backgroundDeep} />
            </RadialGradient>

            <RadialGradient cx='50%' cy='50%' id='felt' r='50%'>
              <Stop offset='0' stopColor={colors.feltGlow} stopOpacity={GLOW_OPACITY} />
              <Stop offset='0.45' stopColor={colors.feltCore} />
              <Stop offset='1' stopColor={colors.feltMid} />
            </RadialGradient>

            <LinearGradient id='rail' x1='0' x2='0' y1='0' y2='1'>
              <Stop offset='0' stopColor={colors.goldBright} />
              <Stop offset='0.5' stopColor={colors.goldDim} />
              <Stop offset='1' stopColor={colors.goldDeep} />
            </LinearGradient>

            <RadialGradient cx='50%' cy='46%' id='vignette' r='80%'>
              <Stop offset='0.55' stopColor={colors.backgroundDeep} stopOpacity='0' />
              <Stop offset='1' stopColor={colors.backgroundDeep} stopOpacity={VIGNETTE_OPACITY} />
            </RadialGradient>

            <Pattern
              height={WEAVE_STEP}
              id='weave'
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

          <Rect fill='url(#room)' height='100%' width='100%' />

          <Ellipse {...oval} fill='url(#rail)' stroke={colors.goldDeep} strokeWidth={2} />

          <Ellipse {...felt} fill='url(#felt)' stroke={colors.goldDeep} strokeWidth={3} />

          <Rect fill='url(#weave)' height='100%' width='100%' />

          <Rect fill='url(#vignette)' height='100%' width='100%' />
        </Svg>
      </View>

      {children}
    </View>
  );
};
