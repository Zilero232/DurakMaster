import type { LobbyTable } from '@durak-master/schemas';

export type TableViewProps = {
  table: LobbyTable;
  isBlocked: boolean;
  isPlaying: boolean;
};
