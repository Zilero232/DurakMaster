export type UseCountToInput = {
  value: number;

  /** How long the whole run takes. Zero lands on the value at once. */
  durationMs: number;

  /** Counts up from zero instead of from the value shown before. */
  isFromZero?: boolean;
};

export type CountRun = {
  from: number;
  step: number;
};
