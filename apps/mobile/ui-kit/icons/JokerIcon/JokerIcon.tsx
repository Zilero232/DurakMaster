import { Circle, Path, Svg } from 'react-native-svg';

import type { JokerIconProps } from './JokerIcon.types';

import { colors } from '../../theme';

export const JokerIcon = ({ size = 24, color = colors.foreground, style }: JokerIconProps) => (
  <Svg height={size} style={style} viewBox='0 0 100 100' width={size}>
    <Path d='M50 58 C32 56 20 42 18 24 C29 22 41 34 50 58 Z' fill={color} />

    <Path d='M50 58 C68 56 80 42 82 24 C71 22 59 34 50 58 Z' fill={color} />

    <Path d='M50 58 C43 40 45 22 50 10 C55 22 57 40 50 58 Z' fill={color} />

    <Circle cx={18} cy={22} fill={color} r={7} />
    <Circle cx={82} cy={22} fill={color} r={7} />
    <Circle cx={50} cy={9} fill={color} r={6} />

    <Path d='M26 58 L74 58 L74 72 L26 72 Z' fill={color} />

    <Path d='M34 78 L66 78 L66 88 L34 88 Z' fill={color} opacity={0.55} />
  </Svg>
);
