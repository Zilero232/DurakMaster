import type { LobbyTable } from '@durak-master/schemas';

export type TableListProps = {
  tables: LobbyTable[];
  onJoin: (tableId: string) => void;
};
