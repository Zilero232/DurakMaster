import { Image, View } from 'react-native';
import Svg, { Defs, RadialGradient, Rect, Stop } from 'react-native-svg';

import type { FeltBackgroundProps } from './FeltBackground.types';

import { colors } from '../../theme';
import {
  FELT_TEXTURE,
  LIGHT_CENTER,
  LIGHT_RADIUS,
  TEXTURE_OPACITY,
  VIGNETTE_OPACITY
} from './FeltBackground.config';
import { styles } from './FeltBackground.styles';

export const FeltBackground = ({ children, style }: FeltBackgroundProps) => (
  <View style={[styles.root, style]}>
    <View pointerEvents='none' style={styles.layer}>
      <Svg height='100%' width='100%'>
        <Defs>
          <RadialGradient cx={LIGHT_CENTER.x} cy={LIGHT_CENTER.y} id='felt' r={LIGHT_RADIUS}>
            <Stop offset='0' stopColor={colors.feltGlow} />
            <Stop offset='0.35' stopColor={colors.feltCore} />
            <Stop offset='0.75' stopColor={colors.feltDeep} />
            <Stop offset='1' stopColor={colors.feltEdge} />
          </RadialGradient>
        </Defs>

        <Rect fill='url(#felt)' height='100%' width='100%' />
      </Svg>

      <Image
        resizeMode='repeat'
        source={FELT_TEXTURE}
        style={[styles.layer, { opacity: TEXTURE_OPACITY }]}
      />

      <Svg height='100%' style={styles.layer} width='100%'>
        <Defs>
          <RadialGradient cx={LIGHT_CENTER.x} cy={LIGHT_CENTER.y} id='edge' r={LIGHT_RADIUS}>
            <Stop offset='0.6' stopColor={colors.backgroundDeep} stopOpacity='0' />
            <Stop offset='1' stopColor={colors.backgroundDeep} stopOpacity={VIGNETTE_OPACITY} />
          </RadialGradient>
        </Defs>

        <Rect fill='url(#edge)' height='100%' width='100%' />
      </Svg>
    </View>

    {children}
  </View>
);
