import type { PlayerView } from '@durak-master/schemas';

export type SeatCall = {
  kind: 'pass' | 'take';
  text: string;
};

export type SeatCallLabels = {
  take: string;
  pass: string;
};

export type SeatCallsInput = {
  view?: PlayerView | null;
  labels: SeatCallLabels;
};

export const seatCalls = ({ view, labels }: SeatCallsInput): Record<string, SeatCall> => {
  const calls: Record<string, SeatCall> = {};

  if (!view || view.game !== 'durak' || view.phase !== 'playing') {
    return calls;
  }

  for (const player of view.players) {
    if (view.isTaking && player.seat === view.defenderSeat) {
      calls[player.userId] = { kind: 'take', text: labels.take };
    } else if (view.passedSeats.includes(player.seat)) {
      calls[player.userId] = { kind: 'pass', text: labels.pass };
    }
  }

  return calls;
};
