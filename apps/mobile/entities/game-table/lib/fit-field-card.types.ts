export type FitFieldCardInput = {
  /** Pairs on the table plus the transfer slot when it shows. */
  slots: number;
  fieldWidth: number;
  fieldHeight: number;

  /** The card width used everywhere else; the field never grows past it. */
  maxWidth: number;
  gap: number;

  /** Width over height of one card. */
  cardRatio: number;
};
