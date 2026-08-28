import { Circle, Svg } from 'react-native-svg';

import type { TauntIconProps } from './TauntIcon.types';

import { FACE } from './TauntIcon.config';
import { FACES } from './TauntIcon.faces';

export const TauntIcon = ({ taunt, size = 44, style }: TauntIconProps) => (
  <Svg height={size} style={style} viewBox='0 0 100 100' width={size}>
    <Circle cx={50} cy={50} fill={FACE.fill} r={46} stroke={FACE.stroke} strokeWidth={2.4} />

    {FACES[taunt]}
  </Svg>
);
