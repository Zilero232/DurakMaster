export type UseSheetPresenceInput = {
  isOpen: boolean;

  /** How long the sheet keeps rendering after it is closed, so it can slide away. */
  exitDurationMs: number;
};
