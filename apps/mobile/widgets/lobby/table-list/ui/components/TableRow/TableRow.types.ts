import type { LobbyTable } from '@durak-master/schemas';

export type TableRowProps = {
  table: LobbyTable;
  isPending?: boolean;
  isDisabled?: boolean;
  myUserId?: string;
  onJoin: (tableId: string) => void;
};
