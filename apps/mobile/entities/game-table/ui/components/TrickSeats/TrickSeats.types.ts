import type { PlayerState, PublicProfile } from '@durak-master/schemas';

export type TrickSeatsProps = {
  players: PlayerState[];
  profiles: PublicProfile[];
  readyUserIds?: Set<string>;
  mySeat: number;
  activeSeat: number;
  leadSeat: number;
  isDealt?: boolean;
  turnDeadline?: number | null;
  turnSeconds?: number;
};
