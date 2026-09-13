import { Circle, Path } from 'react-native-svg';

import { EYE_RADIUS, EYE_Y, FACE, STROKE_WIDTH } from './TauntIcon.config';

export const line = (d: string, key: string) => (
  <Path
    key={key}
    d={d}
    fill='none'
    stroke={FACE.ink}
    strokeLinecap='round'
    strokeWidth={STROKE_WIDTH}
  />
);

export const eye = (cx: number, key: string) => (
  <Circle key={key} cx={cx} cy={EYE_Y} fill={FACE.ink} r={EYE_RADIUS} />
);

export const openMouth = (key: string) => (
  <Path key={key} d='M32 58 Q50 78 68 58 Q50 66 32 58 Z' fill={FACE.mouth} />
);
