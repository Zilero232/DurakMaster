import type { LobbyTable } from '@durak-master/schemas';

export type TableGridProps = {
  tables: LobbyTable[];
  myUserId?: string;
  joiningTableId: string | null;

  /** Desktop lays the tables out as tiles across as many columns as fit. */
  isDesktop: boolean;
  width: number;
  onJoin: (tableId: string) => void;
};
