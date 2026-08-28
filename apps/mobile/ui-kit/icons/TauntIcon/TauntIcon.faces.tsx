import type { TauntId } from '@durak-master/schemas';
import type { ReactNode } from 'react';

import { Circle, Ellipse, Path } from 'react-native-svg';

import { FACE, STROKE_WIDTH } from './TauntIcon.config';

const line = (d: string, key: string) => (
  <Path
    key={key}
    d={d}
    fill='none'
    stroke={FACE.ink}
    strokeLinecap='round'
    strokeWidth={STROKE_WIDTH}
  />
);

const eye = (cx: number, key: string) => (
  <Circle key={key} cx={cx} cy={40} fill={FACE.ink} r={3.4} />
);

const openMouth = (key: string) => (
  <Path key={key} d='M32 58 Q50 78 68 58 Q50 66 32 58 Z' fill={FACE.mouth} />
);

export const FACES: Record<TauntId, ReactNode> = {
  laugh: [
    line('M30 38 Q38 30 46 38', 'e1'),
    line('M54 38 Q62 30 70 38', 'e2'),
    <Path key='m' d='M28 54 Q50 82 72 54 Z' fill={FACE.mouth} />,
    <Path key='t' d='M38 70 Q50 80 62 70 Q50 74 38 70 Z' fill={FACE.tongue} />
  ],

  cry: [
    line('M30 42 Q38 34 46 42', 'e1'),
    line('M54 42 Q62 34 70 42', 'e2'),
    <Path key='t1' d='M34 46 Q31 58 36 62 Q41 58 38 46 Z' fill='#5BA9E8' />,
    <Path key='t2' d='M62 46 Q59 58 64 62 Q69 58 66 46 Z' fill='#5BA9E8' />,
    <Path key='m' d='M34 70 Q50 56 66 70 Z' fill={FACE.mouth} />
  ],

  smug: [
    line('M30 34 Q38 30 46 34', 'b1'),
    line('M54 34 Q62 30 70 34', 'b2'),
    line('M32 44 Q38 40 44 44', 'e1'),
    line('M56 44 Q62 40 68 44', 'e2'),
    line('M34 62 Q50 72 68 58', 'm')
  ],

  bored: [line('M30 40 L44 40', 'e1'), line('M56 40 L70 40', 'e2'), line('M36 64 L64 64', 'm')],

  shades: [
    <Path key='g' d='M24 34 L46 34 L46 48 Q35 52 24 44 Z' fill={FACE.ink} />,
    <Path key='g2' d='M54 34 L76 34 L76 44 Q65 52 54 48 Z' fill={FACE.ink} />,
    <Path key='br' d='M46 36 L54 36' stroke={FACE.ink} strokeWidth={3} />,
    line('M34 64 Q50 74 66 62', 'm')
  ],

  wink: [line('M30 40 Q38 34 46 40', 'e1'), eye(62, 'e2'), line('M34 62 Q50 74 66 62', 'm')],

  angry: [
    line('M28 32 L46 40', 'b1'),
    line('M72 32 L54 40', 'b2'),
    eye(38, 'e1'),
    eye(62, 'e2'),
    line('M34 68 Q50 58 66 68', 'm')
  ],

  shock: [
    line('M28 30 Q38 24 46 30', 'b1'),
    line('M54 30 Q62 24 72 30', 'b2'),
    <Circle key='e1' cx={38} cy={42} fill={FACE.white} r={6} stroke={FACE.ink} strokeWidth={1.4} />,
    <Circle key='e2' cx={62} cy={42} fill={FACE.white} r={6} stroke={FACE.ink} strokeWidth={1.4} />,
    <Circle key='p1' cx={38} cy={43} fill={FACE.ink} r={2.6} />,
    <Circle key='p2' cx={62} cy={43} fill={FACE.ink} r={2.6} />,
    <Ellipse key='m' cx={50} cy={68} fill={FACE.mouth} rx={9} ry={11} />
  ],

  sleep: [
    line('M30 40 Q38 46 46 40', 'e1'),
    line('M54 40 Q62 46 70 40', 'e2'),
    <Ellipse key='m' cx={50} cy={66} fill={FACE.mouth} rx={6} ry={8} />,
    line('M70 24 L80 24 L70 34 L80 34', 'z')
  ],

  think: [
    line('M28 32 Q38 28 46 34', 'b1'),
    line('M54 34 Q62 26 72 32', 'b2'),
    eye(38, 'e1'),
    eye(62, 'e2'),
    line('M38 66 Q50 62 62 68', 'm'),
    <Circle key='h' cx={68} cy={72} fill={FACE.ink} r={3} />
  ],

  kiss: [
    line('M30 38 Q38 32 46 38', 'e1'),
    line('M54 38 Q62 32 70 38', 'e2'),
    <Path
      key='m'
      d='M44 62 Q50 56 56 62 Q50 60 44 62 Z M44 64 Q50 74 56 64 Q50 68 44 64 Z'
      fill={FACE.tongue}
    />
  ],

  tongue: [
    line('M30 38 Q38 32 46 38', 'e1'),
    line('M54 38 Q62 32 70 38', 'e2'),
    openMouth('m'),
    <Path key='t' d='M40 62 Q50 84 60 62 Z' fill={FACE.tongue} />
  ],

  money: [
    line('M30 34 L46 34 M30 46 L46 46 M34 30 L34 50 M42 30 L42 50', 'd1'),
    line('M54 34 L70 34 M54 46 L70 46 M58 30 L58 50 M66 30 L66 50', 'd2'),
    <Path key='m' d='M32 60 Q50 80 68 60 Z' fill={FACE.mouth} />
  ],

  devil: [
    <Path key='h1' d='M22 24 L30 12 L36 26 Z' fill={FACE.ink} />,
    <Path key='h2' d='M78 24 L70 12 L64 26 Z' fill={FACE.ink} />,
    line('M28 34 L46 42', 'b1'),
    line('M72 34 L54 42', 'b2'),
    eye(38, 'e1'),
    eye(62, 'e2'),
    line('M32 60 Q50 76 68 60', 'm')
  ],

  popcorn: [
    line('M30 36 Q38 30 46 36', 'e1'),
    line('M54 36 Q62 30 70 36', 'e2'),
    openMouth('m'),
    <Path key='b' d='M62 62 L82 62 L78 88 L66 88 Z' fill={FACE.tongue} />,
    <Path key='s' d='M66 62 L68 88 M74 62 L72 88' stroke={FACE.white} strokeWidth={2.4} />
  ],

  clown: [
    <Circle key='n' cx={50} cy={54} fill={FACE.tongue} r={7} />,
    line('M28 32 Q38 26 46 32', 'b1'),
    line('M54 32 Q62 26 72 32', 'b2'),
    eye(38, 'e1'),
    eye(62, 'e2'),
    line('M32 68 Q50 80 68 68', 'm'),
    <Path key='h' d='M18 30 Q26 8 42 22' fill='none' stroke={FACE.tongue} strokeWidth={4} />
  ]
};
