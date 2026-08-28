import type { LeagueId } from '@durak-master/schemas';
import type { StyleProp, ViewStyle } from 'react-native';

export type LeagueBadgeProps = {
  league: LeagueId;
  level?: number;
  size?: number;
  style?: StyleProp<ViewStyle>;
};
