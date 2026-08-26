import type { LobbyTable } from '@durak-master/schemas';

import type { ConnectionStatus } from '@/entities/session';

export type TableListProps = {
  tables: LobbyTable[];

  status: ConnectionStatus;
  onJoin: (tableId: string) => void;
  onCreate: () => void;
};
