import type { GameId, LobbyTable } from '@durak-master/schemas';

import { BET_STEPS } from '@durak-master/schemas';
import { useState } from 'react';

export type GameFilter = 'all' | GameId;

export type BetFilter = 'all' | 'high' | 'low' | 'mid';

const LOW_MAX = BET_STEPS[2] ?? 1_000;
const MID_MAX = BET_STEPS[5] ?? 50_000;

const matchesBet = (bet: number, filter: BetFilter): boolean => {
  switch (filter) {
    case 'low': {
      return bet <= LOW_MAX;
    }

    case 'mid': {
      return bet > LOW_MAX && bet <= MID_MAX;
    }

    case 'high': {
      return bet > MID_MAX;
    }

    default: {
      return true;
    }
  }
};

export const useLobbyFilters = (tables: LobbyTable[]) => {
  const [game, setGame] = useState<GameFilter>('all');
  const [bet, setBet] = useState<BetFilter>('all');
  const [hideFull, setHideFull] = useState(false);

  const visible = tables.filter((table) => {
    if (game !== 'all' && table.settings.game !== game) {
      return false;
    }

    if (!matchesBet(table.settings.bet, bet)) {
      return false;
    }

    if (!hideFull) {
      return true;
    }

    return table.status !== 'playing' && table.players.length < table.settings.maxPlayers;
  });

  return {
    game,
    bet,
    hideFull,
    visible,

    isFiltered: visible.length < tables.length,
    setGame,
    setBet,
    toggleHideFull: () => setHideFull((previous) => !previous)
  };
};

export const BET_BRACKETS = { low: LOW_MAX, mid: MID_MAX } as const;
