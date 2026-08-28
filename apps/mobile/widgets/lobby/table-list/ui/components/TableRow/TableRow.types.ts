import type { LobbyTable } from '@durak-master/schemas';

export type TableRowProps = {
  isTile?: boolean;
  table: LobbyTable;
  myUserId?: string;
  onJoin: (tableId: string) => void;
};
