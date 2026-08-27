import { PENALTY_LIMITS } from '@durak-master/schemas';
import { Flame, Layers, User, Users } from 'lucide-react-native';

import type { ModeChoiceField, ModeToggleField } from '../ModesGrid';
import type { OptionItem } from '../OptionRow';

export const PENALTY_LIMIT_ITEMS: OptionItem<number>[] = PENALTY_LIMITS.map((limit) => ({
  value: limit,
  label: String(limit)
}));

export const BURKOZEL_CHOICE_FIELDS: ModeChoiceField[] = [
  {
    name: 'burkozelRules.teamMode',
    options: [
      { value: 'solo', icon: User, labelKey: 'games.burkozel.teamMode.solo' },
      {
        value: 'pairs',
        icon: Users,
        labelKey: 'games.burkozel.teamMode.pairs',
        hintKey: 'games.burkozel.teamMode.pairsHint'
      }
    ]
  }
];

export const BURKOZEL_TOGGLE_FIELDS: ModeToggleField[] = [
  {
    name: 'burkozelRules.shokhaEnabled',
    icon: Flame,
    labelKey: 'games.burkozel.shokha',
    hintKey: 'games.burkozel.shokhaHint'
  },
  {
    name: 'burkozelRules.combinationsEnabled',
    icon: Layers,
    labelKey: 'games.burkozel.combinations',
    hintKey: 'games.burkozel.combinationsHint'
  }
];
