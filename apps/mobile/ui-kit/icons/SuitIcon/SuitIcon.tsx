import { Path, Svg } from 'react-native-svg';

import type { SuitIconProps } from './SuitIcon.types';

import { suitColor } from '../../theme';
import { DEFAULT_THEME, PATHS } from './SuitIcon.config';

export const SuitIcon = ({ suit, size = 24, color, style }: SuitIconProps) => (
  <Svg height={size} style={style} viewBox='0 0 24 24' width={size}>
    <Path d={PATHS[suit]} fill={color ?? suitColor(DEFAULT_THEME, suit)} />
  </Svg>
);
