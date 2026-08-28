import type { BurkozelState, Card, PlayerState } from '@durak-master/schemas';

import { BURKOZEL_HAND_SIZE } from '@durak-master/schemas';

/** The talon is drawn from starting with the player who took the trick. */
function drawOrder(state: BurkozelState, takerSeat: number): PlayerState[] {
  const count = state.players.length;
  const ordered: PlayerState[] = [];

  for (let step = 0; step < count; step++) {
    const seat = (takerSeat + step) % count;
    const player = state.players.find((item) => item.seat === seat);

    if (player) {
      ordered.push(player);
    }
  }

  return ordered;
}

/**
 * Tops every hand back up to a full hand after a trick. The talon can run dry
 * mid-round, which is why the draw goes card by card in seat order instead of
 * handing out whole hands: the last cards must land in the right seats.
 */
export function refill(
  state: BurkozelState,
  hands: Record<string, Card[]>,
  takerSeat: number
): { hands: Record<string, Card[]>; talon: Card[] } {
  const talon = [...state.talon];
  const order = drawOrder(state, takerSeat);
  const next: Record<string, Card[]> = { ...hands };

  let drew = true;

  while (drew && talon.length > 0) {
    drew = false;

    for (const player of order) {
      const hand = next[player.userId] ?? [];

      if (hand.length >= BURKOZEL_HAND_SIZE || talon.length === 0) {
        continue;
      }

      const card = talon.shift();

      if (card) {
        next[player.userId] = [...hand, card];
        drew = true;
      }
    }
  }

  return { hands: next, talon };
}
