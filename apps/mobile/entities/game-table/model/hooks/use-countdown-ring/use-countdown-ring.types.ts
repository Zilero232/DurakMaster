export type UseCountdownRingInput = {
  deadline: number | null;
  totalSeconds: number;

  /** Outer diameter of the ring; the stroke is inset from it. */
  size: number;
};
