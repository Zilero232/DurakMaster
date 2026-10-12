import type { LobbyTable } from '@durak-master/schemas';

export type SeatedPlayersProps = {
  players: LobbyTable['players'];
  hasPremiumPlayer: boolean;
};
