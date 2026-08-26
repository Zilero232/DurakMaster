import {
  ArrowLeftRight,
  ArrowRightToLine,
  Crown,
  Equal,
  Handshake,
  RefreshCw,
  Shuffle,
  Users,
  VenetianMask
} from 'lucide-react-native';

import type { ModeChoiceField, ModeToggleField } from '../ModesGrid';

export const DURAK_CHOICE_FIELDS: ModeChoiceField[] = [
  {
    name: 'durakRules.mode',
    options: [
      { value: 'throwIn', icon: ArrowRightToLine, labelKey: 'games.durak.mode.throwIn' },
      { value: 'transfer', icon: RefreshCw, labelKey: 'games.durak.mode.transfer' }
    ]
  },
  {
    name: 'durakRules.throwInScope',
    options: [
      {
        value: 'neighbors',
        icon: ArrowLeftRight,
        labelKey: 'games.durak.throwInScope.neighbors',
        hintKey: 'games.durak.throwInScope.neighborsHint'
      },
      {
        value: 'all',
        icon: Users,
        labelKey: 'games.durak.throwInScope.all',
        hintKey: 'games.durak.throwInScope.allHint'
      }
    ]
  },
  {
    name: 'durakRules.fairness',
    options: [
      { value: 'fair', icon: Handshake, labelKey: 'games.durak.fairness.fair' },
      {
        value: 'cheaters',
        icon: VenetianMask,
        labelKey: 'games.durak.fairness.cheaters',
        hintKey: 'games.durak.fairness.cheatersHint'
      }
    ]
  },
  {
    name: 'durakRules.firstMove',
    options: [
      {
        value: 'lowestTrump',
        icon: Crown,
        labelKey: 'games.durak.firstMove.lowestTrump',
        hintKey: 'games.durak.firstMove.lowestTrumpHint'
      },
      { value: 'random', icon: Shuffle, labelKey: 'games.durak.firstMove.random' }
    ]
  }
];

export const DURAK_TOGGLE_FIELDS: ModeToggleField[] = [
  { name: 'durakRules.allowDraw', icon: Equal, labelKey: 'games.durak.allowDraw' },
  {
    name: 'durakRules.allowTransferByShowingTrump',
    icon: RefreshCw,
    labelKey: 'games.durak.showTrump',
    hintKey: 'games.durak.showTrumpHint'
  }
];
