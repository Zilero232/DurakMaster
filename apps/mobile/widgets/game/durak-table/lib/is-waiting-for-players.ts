import type { LobbyTable, PlayerView } from '@durak-master/schemas';

export type IsWaitingForPlayersInput = {
  table: Pick<LobbyTable, 'status'> | null;
  view: PlayerView | null;
};

export const isWaitingForPlayers = ({ table, view }: IsWaitingForPlayersInput): boolean => {
  if (!view) {
    return true;
  }

  return table?.status === 'waiting' || view.phase === 'waiting' || view.phase === 'finished';
};
