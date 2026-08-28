import type { BoostId } from '@durak-master/schemas';
import type { ParseKeys } from 'i18next';
import type { LucideIcon } from 'lucide-react-native';

import { Eye, Layers, Undo2 } from 'lucide-react-native';

export const BOOST_ICONS: Record<BoostId, LucideIcon> = {
  undoMove: Undo2,
  peekTalon: Layers,
  peekHand: Eye
};

export const BOOST_LABELS: Record<BoostId, ParseKeys> = {
  undoMove: 'boosts.undoMove',
  peekTalon: 'boosts.peekTalon',
  peekHand: 'boosts.peekHand'
};

export const BOOST_HINTS: Record<BoostId, ParseKeys> = {
  undoMove: 'boosts.undoMoveHint',
  peekTalon: 'boosts.peekTalonHint',
  peekHand: 'boosts.peekHandHint'
};
