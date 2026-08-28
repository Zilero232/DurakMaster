import type { LobbyTable, MyProfile, TableSettings } from '@durak-master/schemas';

import type { ConnectionStatus } from '@/entities/session';

import type { ShellPanel } from '../../../../model';
import type { ShellTab } from '../../AppShell.types';

export type ShellContentProps = {
  tab: ShellTab;
  profile: MyProfile | null;
  tables: LobbyTable[];
  status: ConnectionStatus;
  onJoin: (tableId: string) => void;
  onCreateTable: (settings: TableSettings, password?: string) => void;
  onGoToCreate: () => void;
  onClaimBonus: () => void;
  onOpenPanel: (panel: ShellPanel) => void;
};
