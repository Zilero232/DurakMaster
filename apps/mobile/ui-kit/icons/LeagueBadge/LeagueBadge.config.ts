import type { LeagueId } from '@durak-master/schemas';

type LeagueLook = {
  light: string;
  dark: string;
  gem: string;
  stars: number;
};

export const LEAGUE_LOOK: Record<LeagueId, LeagueLook> = {
  silver: { light: '#E6E9EF', dark: '#8A9099', gem: '#F4F6FA', stars: 1 },
  gold: { light: '#F6D98A', dark: '#B8860F', gem: '#FFF0BE', stars: 2 },
  ruby: { light: '#F08A84', dark: '#9E2F2A', gem: '#FFC9C5', stars: 3 },
  emerald: { light: '#7FD9A9', dark: '#2A7C52', gem: '#C4F5DC', stars: 4 },
  sapphire: { light: '#7FA8ED', dark: '#2A55A0', gem: '#C2D8FF', stars: 5 },
  supreme: { light: '#C79BEA', dark: '#6B3FA0', gem: '#EBD6FF', stars: 6 }
};
