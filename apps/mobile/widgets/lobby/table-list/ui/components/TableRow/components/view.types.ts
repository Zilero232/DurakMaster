import type { LobbyTable } from '@durak-master/schemas';

export type TableViewProps = {
  table: LobbyTable;
  isMine: boolean;
  isBlocked: boolean;
  isPlaying: boolean;
};
