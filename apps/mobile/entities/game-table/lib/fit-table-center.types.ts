export type FitTableCenterInput = {
  width: number;
  height: number;

  /** Pairs on the table plus the transfer slot when it shows. */
  slots: number;

  /** The card width used everywhere else; the centre never grows past it. */
  maxCardWidth: number;
  gap: number;

  /** Width over height of one card. */
  cardRatio: number;
};

export type TableCenterMetrics = {
  card: number;
  field: number;
};
