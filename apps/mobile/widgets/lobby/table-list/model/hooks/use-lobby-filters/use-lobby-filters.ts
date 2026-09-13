import type { LobbyTable } from '@durak-master/schemas';

import { useState } from 'react';

import type { BetFilter } from '../../../config';

import { matchesBet } from '../../../lib';

export const useLobbyFilters = (tables: LobbyTable[]) => {
  const [bet, setBet] = useState<BetFilter>('all');
  const [hideFull, setHideFull] = useState(false);

  const visible = tables.filter((table) => {
    if (!matchesBet({ bet: table.settings.bet, filter: bet })) {
      return false;
    }

    if (!hideFull) {
      return true;
    }

    return table.status !== 'playing' && table.players.length < table.settings.maxPlayers;
  });

  return {
    bet,
    hideFull,
    visible,

    isFiltered: visible.length < tables.length,
    setBet,
    toggleHideFull: () => setHideFull((previous) => !previous)
  };
};
