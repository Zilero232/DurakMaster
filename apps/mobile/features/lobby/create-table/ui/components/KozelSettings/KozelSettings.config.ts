import { Crown, Layers, RectangleHorizontal, Spade, Swords } from 'lucide-react-native';

import type { ModeChoiceField, ModeToggleField } from '../ModesGrid';
import type { OptionItem } from '../OptionRow';

export const TARGET_PAIRS_ITEMS: OptionItem<number>[] = [3, 6, 12].map((pairs) => ({
  value: pairs,
  label: String(pairs)
}));

export const KOZEL_CHOICE_FIELDS: ModeChoiceField[] = [
  {
    name: 'kozelRules.firstLead',
    options: [
      {
        value: 'lowestTrump',
        icon: Crown,
        labelKey: 'games.kozel.firstLead.lowestTrump',
        hintKey: 'games.kozel.firstLead.lowestTrumpHint'
      },
      { value: 'leftOfDealer', icon: Swords, labelKey: 'games.kozel.firstLead.leftOfDealer' },
      { value: 'dealer', icon: Layers, labelKey: 'games.kozel.firstLead.dealer' }
    ]
  }
];

export const KOZEL_TOGGLE_FIELDS: ModeToggleField[] = [
  {
    name: 'kozelRules.shamokIsHighest',
    icon: Spade,
    labelKey: 'games.kozel.shamok',
    hintKey: 'games.kozel.shamokHint'
  },
  {
    name: 'kozelRules.aceDiscardRestriction',
    icon: RectangleHorizontal,
    labelKey: 'games.kozel.aceRestriction',
    hintKey: 'games.kozel.aceRestrictionHint'
  }
];
