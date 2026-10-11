import type { LobbyTable } from '@durak-master/schemas';

export type TableGridProps = {
  tables: LobbyTable[];
  myUserId?: string;
  joiningTableId: string | null;
  onJoin: (tableId: string) => void;
};
