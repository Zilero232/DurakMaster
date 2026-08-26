import type { GameId } from '@durak-master/schemas';
import type { LucideIcon } from 'lucide-react-native';

import { Club, Diamond, Heart, Spade } from 'lucide-react-native';

export const GAME_ICONS: Record<GameId, LucideIcon> = {
  durak: Spade,
  burkozel: Heart,
  kozel: Club,
  tysyacha: Diamond
};
