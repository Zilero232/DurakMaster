import type { LobbyTable } from '@durak-master/schemas';

export type TableRowProps = {
  table: LobbyTable;
  onJoin: (tableId: string) => void;
};
