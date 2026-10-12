export type MatchResultProps = {
  isLoser: boolean;
  isDraw: boolean;
  creditsDelta: number;
  ratingDelta: number;

  /** Still seated at the table, so the next deal can start without leaving it. */
  canRematch: boolean;
  onRematch: () => void;
  onToMenu: () => void;
};
