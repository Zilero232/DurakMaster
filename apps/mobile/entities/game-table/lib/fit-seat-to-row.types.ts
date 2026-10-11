export type SeatMetrics = {
  avatar: number;
  ring: number;
  back: number;
  label: number;

  /** Every seat takes the same slot, so a bot, a player and an empty chair never shift the row. */
  width: number;
};

export type SeatBase = Omit<SeatMetrics, 'back'>;

export type SeatLabelRange = { min: number; max: number };

export type FitSeatToRowInput = {
  base: SeatBase;

  /** Bounds the label may scale between. */
  label: SeatLabelRange;
  width: number;
  seats: number;
};
