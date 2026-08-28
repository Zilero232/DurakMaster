import type { ConnectionStatus } from '@/entities/session';

import type { ShellTab } from '../../AppShell.types';

export type SideRailProps = {
  tab: ShellTab;
  status: ConnectionStatus;
  onChange: (tab: ShellTab) => void;
  onSignOut: () => void;
};
