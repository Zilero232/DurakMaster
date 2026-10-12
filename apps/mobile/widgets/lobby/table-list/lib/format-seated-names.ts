import type { LobbyTable } from '@durak-master/schemas';

export const formatSeatedNames = (players: LobbyTable['players']): string | null => {
  const [first] = players;

  if (!first) {
    return null;
  }

  const others = players.length - 1;

  return others > 0 ? `${first.name} +${others}` : first.name;
};
