import type { Card, ViewForGame } from '@durak-master/schemas';

import { canTransfer } from '@durak-master/game-core';

type DurakView = ViewForGame<'durak'>;

const nextDefenderHandSize = (view: DurakView): number => {
  const count = view.players.length;

  for (let step = 1; step <= count; step++) {
    const seat = (view.defenderSeat + step) % count;
    const player = view.players.find((item) => item.seat === seat);

    if (player && !player.isOut) {
      return player.handCount;
    }
  }

  return 0;
};

export const canTransferCard = (view: DurakView | null, card: Card): boolean => {
  if (!view || view.phase !== 'playing' || view.rules.mode !== 'transfer' || view.isTaking) {
    return false;
  }

  return canTransfer(card, view.table, nextDefenderHandSize(view));
};
