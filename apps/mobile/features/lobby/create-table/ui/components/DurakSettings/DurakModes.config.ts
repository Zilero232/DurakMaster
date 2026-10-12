import type { DurakRules } from '@durak-master/schemas';

import { RULE_ICONS } from '@/entities/game-table';

import type { ModeChoiceField, ModeToggleField } from '../ModesGrid';

export const DURAK_CHOICE_FIELDS: ModeChoiceField[] = [
  {
    name: 'durakRules.mode',
    titleKey: 'games.durak.mode.title',
    options: [
      { value: 'throwIn', icon: RULE_ICONS.throwIn, labelKey: 'games.durak.mode.throwIn' },
      { value: 'transfer', icon: RULE_ICONS.transfer, labelKey: 'games.durak.mode.transfer' }
    ]
  },
  {
    name: 'durakRules.throwInScope',
    titleKey: 'games.durak.throwInScope.title',
    options: [
      {
        value: 'all',
        icon: RULE_ICONS.allScope,
        labelKey: 'games.durak.throwInScope.all',
        hintKey: 'games.durak.throwInScope.allHint'
      },
      {
        value: 'neighbors',
        icon: RULE_ICONS.neighborsScope,
        labelKey: 'games.durak.throwInScope.neighbors',
        hintKey: 'games.durak.throwInScope.neighborsHint'
      }
    ]
  },
  {
    name: 'durakRules.fairness',
    titleKey: 'games.durak.fairness.title',
    options: [
      { value: 'fair', icon: RULE_ICONS.fair, labelKey: 'games.durak.fairness.fair' },
      {
        value: 'cheaters',
        icon: RULE_ICONS.cheaters,
        labelKey: 'games.durak.fairness.cheaters',
        hintKey: 'games.durak.fairness.cheatersHint'
      }
    ]
  },
  {
    name: 'durakRules.firstMove',
    titleKey: 'games.durak.firstMove.title',
    options: [
      {
        value: 'lowestTrump',
        icon: RULE_ICONS.lowestTrump,
        labelKey: 'games.durak.firstMove.lowestTrump',
        hintKey: 'games.durak.firstMove.lowestTrumpHint'
      },
      { value: 'random', icon: RULE_ICONS.random, labelKey: 'games.durak.firstMove.random' }
    ]
  }
];

const DURAK_TOGGLE_FIELDS: (ModeToggleField & { onlyInMode?: DurakRules['mode'] })[] = [
  { name: 'durakRules.allowDraw', icon: RULE_ICONS.draw, labelKey: 'games.durak.allowDraw' },
  {
    name: 'durakRules.allowTransferByShowingTrump',
    icon: RULE_ICONS.showTrump,
    labelKey: 'games.durak.showTrump',
    hintKey: 'games.durak.showTrumpHint',
    onlyInMode: 'transfer'
  },
  {
    name: 'durakRules.withJokers',
    icon: RULE_ICONS.jokers,
    labelKey: 'games.durak.withJokers',
    hintKey: 'games.durak.withJokersHint'
  }
];

export const durakToggleFields = (mode: DurakRules['mode']): ModeToggleField[] =>
  DURAK_TOGGLE_FIELDS.filter((field) => !field.onlyInMode || field.onlyInMode === mode);
