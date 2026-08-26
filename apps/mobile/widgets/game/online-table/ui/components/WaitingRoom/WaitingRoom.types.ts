import type { LobbyTable } from '@durak-master/schemas';

export type WaitingRoomProps = {
  table: LobbyTable;
  mySeat: number;
  onReady: (isReady: boolean) => void;
  onAddBot: () => void;
  onLeave: () => void;
};
