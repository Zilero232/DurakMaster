import type { SettingsForGame } from '@durak-master/schemas';
import type { TFunction } from 'i18next';

import type { TableRuleIcon } from '@/entities/game-table';

export type TableRule = {
  icon: TableRuleIcon;
  label: string;
  value: string;
  isInStrip: boolean;

  /** Shown next to the icon in the strip; without it the icon stands alone. */
  stripText: string | null;
};

export type DescribeTableRulesInput = {
  settings: SettingsForGame<'durak'>;
  t: TFunction;
};
