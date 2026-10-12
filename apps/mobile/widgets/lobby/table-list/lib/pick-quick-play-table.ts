import type { LobbyTable } from '@durak-master/schemas';

import type { PickQuickPlayTableInput } from './pick-quick-play-table.types';

const closestToStart = (a: LobbyTable, b: LobbyTable): number =>
  b.players.length - a.players.length ||
  a.settings.bet - b.settings.bet ||
  a.createdAt - b.createdAt;

export const pickQuickPlayTable = ({
  tables,
  credits,
  myUserId
}: PickQuickPlayTableInput): LobbyTable | null => {
  const joinable = tables.filter(({ status, settings, players }) => {
    const hasFreeSeat = players.length < settings.maxPlayers;
    const isSeated = players.some((player) => player.userId === myUserId);

    return (
      status === 'waiting' &&
      !settings.isPrivate &&
      hasFreeSeat &&
      !isSeated &&
      settings.bet <= credits
    );
  });

  return [...joinable].sort(closestToStart)[0] ?? null;
};
