import type { PublicProfile, ViewForGame } from '@durak-master/schemas';

export type OpponentsRowProps = {
  view: ViewForGame<'durak'>;
  players: PublicProfile[];
  mySeat: number;
  phrases: Record<string, string>;

  turnSeconds: number;
};
