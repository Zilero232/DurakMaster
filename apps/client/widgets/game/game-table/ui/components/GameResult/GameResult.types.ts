export type GameResultProps = {
  isDraw: boolean;
  isLoser: boolean;
  creditsDelta?: number;
  ratingDelta?: number;
  onExit: () => void;
  onRestart?: () => void;
};
