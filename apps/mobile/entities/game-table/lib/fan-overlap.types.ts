export type FanOverlapInput = {
  count: number;
  width: number;

  /** Row width the fan may spread across. */
  available: number;

  /** How much neighbours overlap while the hand still fits, as a share of card width. */
  looseRatio: number;
};
