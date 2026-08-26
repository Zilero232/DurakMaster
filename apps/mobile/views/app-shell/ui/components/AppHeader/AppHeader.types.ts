import type { ConnectionStatus } from '@/entities/session';

import type { ShellTab } from '../../AppShell.types';

export type AppHeaderProps = {
  tab: ShellTab;
  status: ConnectionStatus;
  onOpenSettings: () => void;
};
