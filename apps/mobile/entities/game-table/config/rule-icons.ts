import type { LucideIcon } from 'lucide-react-native';

import {
  ArrowLeftRight,
  ArrowRightToLine,
  Coins,
  Crown,
  Equal,
  Eye,
  Handshake,
  Layers,
  Rabbit,
  RefreshCw,
  Shuffle,
  Sparkles,
  Timer,
  Users,
  VenetianMask
} from 'lucide-react-native';

import type { TableRuleIcon } from './rule-icons.types';

export const RULE_ICONS: Record<TableRuleIcon, LucideIcon> = {
  bet: Coins,
  deck: Layers,
  throwIn: ArrowRightToLine,
  transfer: RefreshCw,
  allScope: Users,
  neighborsScope: ArrowLeftRight,
  fair: Handshake,
  cheaters: VenetianMask,
  jokers: Sparkles,
  fastSpeed: Rabbit,
  normalSpeed: Timer,
  draw: Equal,
  showTrump: Eye,
  lowestTrump: Crown,
  random: Shuffle
};
