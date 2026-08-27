import { Circle, Path, Svg } from 'react-native-svg';

import type { LoserHatProps } from './LoserHat.types';

const HAT = '#E8543F';

const BAND = '#F4D03F';

const POMPOM = '#F4F1EC';

export const LoserHat = ({ size = 28, style }: LoserHatProps) => (
  <Svg height={size} style={style} viewBox='0 0 100 100' width={size}>
    <Path d='M50 6 L78 74 L22 74 Z' fill={HAT} />

    <Path d='M50 6 L62 36 L38 36 Z' fill={BAND} opacity={0.45} />

    <Path d='M20 74 L80 74 L80 86 L20 86 Z' fill={BAND} />

    <Circle cx={50} cy={8} fill={POMPOM} r={9} />
  </Svg>
);
