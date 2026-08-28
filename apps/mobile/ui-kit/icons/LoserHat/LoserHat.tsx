import { Circle, Path, Svg } from 'react-native-svg';

import type { LoserHatProps } from './LoserHat.types';

const LEFT = '#E8543F';

const MIDDLE = '#F4D03F';

const RIGHT = '#4FA3E3';

const BELL = '#F7E7A1';

const BAND = '#2B2340';

export const LoserHat = ({ size = 28, style }: LoserHatProps) => (
  <Svg height={size} style={style} viewBox='0 0 100 100' width={size}>
    <Path d='M50 64 C30 62 16 46 14 26 C26 24 40 38 50 64 Z' fill={LEFT} />

    <Path d='M50 64 C70 62 84 46 86 26 C74 24 60 38 50 64 Z' fill={RIGHT} />

    <Path d='M50 64 C42 44 44 24 50 10 C56 24 58 44 50 64 Z' fill={MIDDLE} />

    <Circle cx={14} cy={24} fill={BELL} r={8} />
    <Circle cx={86} cy={24} fill={BELL} r={8} />
    <Circle cx={50} cy={9} fill={BELL} r={7} />

    <Path d='M22 62 L78 62 L78 78 L22 78 Z' fill={BAND} />

    <Path d='M22 62 L78 62 L78 68 L22 68 Z' fill={MIDDLE} opacity={0.5} />
  </Svg>
);
