export type TurnStatus = { kind: 'defends' | 'moves'; name: string } | { kind: 'mine' };

export type PickTurnStatusInput = {
  activeSeat: number | null;
  defenderSeat: number | null;
  mySeat: number | null;
  players: readonly { seat: number; name: string }[];
  isWaiting: boolean;
};
