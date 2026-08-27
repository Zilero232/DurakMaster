import type { PlayerState, PublicProfile } from '@durak-master/schemas';

export type TrickSeatsProps = {
  players: PlayerState[];
  profiles: PublicProfile[];
  mySeat: number;
  activeSeat: number;
  leadSeat: number;
  turnDeadline?: number | null;
  turnSeconds?: number;
};
