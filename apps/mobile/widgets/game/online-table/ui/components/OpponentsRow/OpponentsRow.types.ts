import type { PlayerView, PublicProfile } from '@durak-master/schemas';

export type OpponentsRowProps = {
  view: PlayerView;
  players: PublicProfile[];
  mySeat: number;
  phrases: Record<string, string>;
};
