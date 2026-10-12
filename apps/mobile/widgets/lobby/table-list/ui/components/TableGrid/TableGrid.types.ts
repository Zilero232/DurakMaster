import type { LobbyTable } from '@durak-master/schemas';

export type TableGridProps = {
  tables: LobbyTable[];
  myUserId?: string;
  joiningTableId: string | null;
  isRefreshing: boolean;
  onJoin: (tableId: string) => void;
  onRefresh: () => void;
};
