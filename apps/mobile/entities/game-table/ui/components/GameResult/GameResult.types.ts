export type GameResultProps = {
  isDraw: boolean;
  isLoser: boolean;
  creditsDelta?: number;
  ratingDelta?: number;
  onExit: () => void;
  onRestart?: () => void;
};

export type ResultTone = 'draw' | 'lose' | 'win';
