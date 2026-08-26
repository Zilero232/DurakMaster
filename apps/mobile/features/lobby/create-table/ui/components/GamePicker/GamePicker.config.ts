import type { GameId } from '@durak-master/schemas';
import type { LucideIcon } from 'lucide-react-native';

import { GAME_IDS } from '@durak-master/schemas';
import { Club, Diamond, Heart, Spade } from 'lucide-react-native';

const GAME_ICONS: Record<GameId, LucideIcon> = {
  durak: Spade,
  burkozel: Heart,
  kozel: Club,
  tysyacha: Diamond
};

export const GAME_ITEMS: { id: GameId; icon: LucideIcon }[] = GAME_IDS.map((id) => ({
  id,
  icon: GAME_ICONS[id]
}));
