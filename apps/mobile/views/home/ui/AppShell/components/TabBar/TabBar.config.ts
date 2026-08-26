import type { Suit } from '@durak-master/schemas';
import type { ParseKeys } from 'i18next';

import type { ShellTab } from '../../AppShell.types';

type TabConfig = {
  id: ShellTab;
  labelKey: ParseKeys;
  suit: Suit;
};

export const TABS: readonly TabConfig[] = [
  { id: 'profile', labelKey: 'nav.profile', suit: 'clubs' },
  { id: 'tables', labelKey: 'nav.tables', suit: 'hearts' },
  { id: 'create', labelKey: 'nav.create', suit: 'diamonds' }
];
