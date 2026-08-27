import type { LobbyTable, MyProfile, TableSettings } from '@durak-master/schemas';

import type { ConnectionStatus } from '@/entities/session';

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
  onOpenRules: () => void;
  onOpenSettings: () => void;
  onOpenStats: () => void;
  onOpenFriends: () => void;
  onOpenProfileEditor: () => void;
  onOpenAchievements: () => void;
  onOpenLeaderboard: () => void;
};
