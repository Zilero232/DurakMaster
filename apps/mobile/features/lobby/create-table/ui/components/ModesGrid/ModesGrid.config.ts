import type { Fairness, GameMode, ThrowInScope } from '@durak-master/schemas';
import type { ParseKeys } from 'i18next';
import type { LucideIcon } from 'lucide-react-native';

import {
  ArrowLeftRight,
  ArrowRightToLine,
  Crown,
  Equal,
  Handshake,
  RefreshCw,
  Users,
  VenetianMask
} from 'lucide-react-native';

import type { CreateTableFormValues } from '../../../model';

type ChoiceOption<T> = {
  value: T;
  icon: LucideIcon;
  labelKey: ParseKeys;
  hintKey?: ParseKeys;
};

export const CHOICE_FIELDS: [
  { name: 'mode'; options: ChoiceOption<GameMode>[] },
  { name: 'throwInScope'; options: ChoiceOption<ThrowInScope>[] },
  { name: 'fairness'; options: ChoiceOption<Fairness>[] }
] = [
  {
    name: 'mode',
    options: [
      { value: 'throwIn', icon: ArrowRightToLine, labelKey: 'create.mode.throwIn' },
      { value: 'transfer', icon: RefreshCw, labelKey: 'create.mode.transfer' }
    ]
  },
  {
    name: 'throwInScope',
    options: [
      {
        value: 'neighbors',
        icon: ArrowLeftRight,
        labelKey: 'create.mode.neighbors',
        hintKey: 'create.mode.neighborsHint'
      },
      {
        value: 'all',
        icon: Users,
        labelKey: 'create.mode.all',
        hintKey: 'create.mode.allHint'
      }
    ]
  },
  {
    name: 'fairness',
    options: [
      { value: 'fair', icon: Handshake, labelKey: 'create.mode.fair' },
      {
        value: 'cheaters',
        icon: VenetianMask,
        labelKey: 'create.mode.cheaters',
        hintKey: 'create.mode.cheatersHint'
      }
    ]
  }
];

export const TOGGLE_FIELDS: {
  name: Extract<keyof CreateTableFormValues, 'allowDraw' | 'isClassic'>;
  icon: LucideIcon;
  labelKey: ParseKeys;
  hintKey?: ParseKeys;
}[] = [
  {
    name: 'isClassic',
    icon: Crown,
    labelKey: 'create.mode.classic',
    hintKey: 'create.mode.classicHint'
  },
  { name: 'allowDraw', icon: Equal, labelKey: 'create.mode.draw' }
];
