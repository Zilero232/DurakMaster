import type { LobbyTable, PlayerView } from '@durak-master/schemas';

export const isWaitingForPlayers = (
  table: Pick<LobbyTable, 'status'> | null,
  view: PlayerView | null
): boolean => {
  if (!view) {
    return true;
  }

  return table?.status === 'waiting' || view.phase === 'waiting' || view.phase === 'finished';
};
