import type { PlayerState } from '@durak-master/schemas';

type FindActiveSeatInput = {
  players: readonly PlayerState[];
  fromSeat: number;
  direction: -1 | 1;
};

export const seatOf = (players: readonly PlayerState[], userId: string): number | null =>
  players.find((player) => player.userId === userId)?.seat ?? null;

const findActiveSeat = ({ players, fromSeat, direction }: FindActiveSeatInput): number => {
  const count = players.length;

  for (let step = 1; step <= count; step++) {
    const seat = (((fromSeat + direction * step) % count) + count) % count;
    const player = players.find((item) => item.seat === seat);

    if (player && !player.isOut) {
      return seat;
    }
  }

  return fromSeat;
};

export const nextActiveSeat = (players: readonly PlayerState[], fromSeat: number): number =>
  findActiveSeat({ players, fromSeat, direction: 1 });

export const previousActiveSeat = (players: readonly PlayerState[], fromSeat: number): number =>
  findActiveSeat({ players, fromSeat, direction: -1 });
