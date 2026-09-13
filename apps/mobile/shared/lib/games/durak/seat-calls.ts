import type { PlayerView } from '@durak-master/schemas';

export type SeatCall = {
  text: string;
  sentAt: number;
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
      calls[player.userId] = { text: labels.take, sentAt: view.defenderSeat };
    } else if (view.passedSeats.includes(player.seat)) {
      calls[player.userId] = {
        text: labels.pass,
        sentAt: view.passedSeats.indexOf(player.seat)
      };
    }
  }

  return calls;
};
