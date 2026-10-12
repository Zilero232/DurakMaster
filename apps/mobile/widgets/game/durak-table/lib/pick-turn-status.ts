import type { PickTurnStatusInput, TurnStatus } from './pick-turn-status.types';

export const pickTurnStatus = ({
  activeSeat,
  defenderSeat,
  mySeat,
  players,
  isWaiting
}: PickTurnStatusInput): TurnStatus | null => {
  if (isWaiting || activeSeat === null) {
    return null;
  }

  if (activeSeat === mySeat) {
    return { kind: 'mine' };
  }

  const name = players.find((player) => player.seat === activeSeat)?.name ?? '';

  return { kind: activeSeat === defenderSeat ? 'defends' : 'moves', name };
};
