import { Award, BookOpen, Settings, Share2, Trophy, Users } from 'lucide-react-native';

import { colors } from '@/ui-kit';

import type { ProfileMenuEntry } from './ProfileMenu.types';

export const PROFILE_MENU_ITEMS: ProfileMenuEntry[] = [
  { id: 'friends', icon: Users, tint: colors.info, badgeTone: 'danger' },
  { id: 'achievements', icon: Award, tint: colors.gold, badgeTone: 'gold' },
  { id: 'leaderboard', icon: Trophy, tint: colors.accentBright },
  { id: 'rules', icon: BookOpen, tint: colors.mutedForeground },
  { id: 'settings', icon: Settings, tint: colors.success },
  { id: 'share', icon: Share2, tint: colors.trump }
];
