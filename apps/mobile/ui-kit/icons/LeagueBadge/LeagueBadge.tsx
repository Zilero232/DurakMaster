import { Defs, LinearGradient, Path, Stop, Svg, Text as SvgText } from 'react-native-svg';

import type { LeagueBadgeProps } from './LeagueBadge.types';

import { LEAGUE_LOOK } from './LeagueBadge.config';

const CREST = 'M24 2 L44 9 L44 28 C44 40 35 49 24 54 C13 49 4 40 4 28 L4 9 Z';

const GEM = 'M24 18 L32 27 L24 36 L16 27 Z';

export const LeagueBadge = ({ league, level, size = 44, style }: LeagueBadgeProps) => {
  const look = LEAGUE_LOOK[league];
  const gradientId = `league-${league}`;

  return (
    <Svg height={size} style={style} viewBox='0 0 48 56' width={(size * 48) / 56}>
      <Defs>
        <LinearGradient id={gradientId} x1='0' x2='0' y1='0' y2='1'>
          <Stop offset='0' stopColor={look.light} />
          <Stop offset='1' stopColor={look.dark} />
        </LinearGradient>
      </Defs>

      <Path d={CREST} fill={`url(#${gradientId})`} stroke={look.dark} strokeWidth={1.5} />

      {level === undefined ? (
        <Path d={GEM} fill={look.gem} opacity={0.92} />
      ) : (
        <SvgText fill={look.dark} fontSize={20} fontWeight='bold' textAnchor='middle' x={24} y={34}>
          {level}
        </SvgText>
      )}
    </Svg>
  );
};
