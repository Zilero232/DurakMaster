import type { LobbyTable } from '@durak-master/schemas';

export type TableRowProps = {
  isTile?: boolean;
  table: LobbyTable;
  onJoin: (tableId: string) => void;
};
