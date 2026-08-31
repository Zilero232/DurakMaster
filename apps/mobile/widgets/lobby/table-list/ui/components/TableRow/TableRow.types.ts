import type { LobbyTable } from '@durak-master/schemas';

export type TableRowProps = {
  isTile?: boolean;
  isPending?: boolean;
  table: LobbyTable;
  myUserId?: string;
  onJoin: (tableId: string) => void;
};
