import { Coins, Crown, Eye, EyeOff, Spade, Truck } from 'lucide-react-native';

import type { ModeChoiceField, ModeToggleField } from '../ModesGrid';
import type { OptionItem } from '../OptionRow';

export const WINNING_SCORE_ITEMS: OptionItem<number>[] = [1000, 1001].map((score) => ({
  value: score,
  label: String(score)
}));

export const BID_STEP_ITEMS: OptionItem<number>[] = [5, 10].map((step) => ({
  value: step,
  label: String(step)
}));

export const TYSYACHA_CHOICE_FIELDS: ModeChoiceField[] = [
  {
    name: 'tysyachaRules.discardVisibility',
    titleKey: 'games.tysyacha.discardVisibility.title',
    options: [
      {
        value: 'closed',
        icon: EyeOff,
        labelKey: 'games.tysyacha.discardVisibility.closed',
        hintKey: 'games.tysyacha.discardVisibility.closedHint'
      },
      {
        value: 'open',
        icon: Eye,
        labelKey: 'games.tysyacha.discardVisibility.open',
        hintKey: 'games.tysyacha.discardVisibility.openHint'
      }
    ]
  },
  {
    name: 'tysyachaRules.skipBonus',
    titleKey: 'games.tysyacha.skipBonus.title',
    options: [
      { value: 'none', icon: Spade, labelKey: 'games.tysyacha.skipBonus.none' },
      {
        value: 'aces',
        icon: Crown,
        labelKey: 'games.tysyacha.skipBonus.aces',
        hintKey: 'games.tysyacha.skipBonus.acesHint'
      },
      { value: 'fixed30', icon: Coins, labelKey: 'games.tysyacha.skipBonus.fixed30' }
    ]
  }
];

export const TYSYACHA_TOGGLE_FIELDS: ModeToggleField[] = [
  {
    name: 'tysyachaRules.marriageOnFirstTrick',
    icon: Crown,
    labelKey: 'games.tysyacha.marriageOnFirstTrick',
    hintKey: 'games.tysyacha.marriageOnFirstTrickHint'
  },
  {
    name: 'tysyachaRules.dumpTruck',
    icon: Truck,
    labelKey: 'games.tysyacha.dumpTruck',
    hintKey: 'games.tysyacha.dumpTruckHint'
  }
];
