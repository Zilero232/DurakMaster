export type SeatMetrics = {
  avatar: number;
  ring: number;
  hat: number;
  back: number;
  label: number;
  minWidth: number;
  maxWidth: number;
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
