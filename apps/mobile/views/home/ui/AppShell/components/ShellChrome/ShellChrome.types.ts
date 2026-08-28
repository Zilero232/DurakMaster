import type { ReactNode } from 'react';

import type { ConnectionStatus } from '@/entities/session';

import type { ShellTab } from '../../AppShell.types';

export type ShellChromeProps = {
  children: ReactNode;
  tab: ShellTab;
  status: ConnectionStatus;
  onChange: (tab: ShellTab) => void;
  onSignOut: () => void;
};
