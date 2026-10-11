export type WinRateInput = {
  gamesPlayed: number;
  gamesWon: number;
};

export const getWinRate = ({ gamesPlayed, gamesWon }: WinRateInput): number =>
  gamesPlayed > 0 ? gamesWon / gamesPlayed : 0;
