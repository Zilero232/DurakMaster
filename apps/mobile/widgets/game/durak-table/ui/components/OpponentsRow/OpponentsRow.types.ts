import type { PublicProfile, ViewForGame } from '@durak-master/schemas';

import type { Chatter } from '@/entities/game-table';

export type OpponentsRowProps = {
  view: ViewForGame<'durak'>;
  players: PublicProfile[];
  readyUserIds: Set<string>;
  mySeat: number;
  phrases: Record<string, Chatter>;

  turnSeconds: number;

  /** While the table waits, an empty seat invites a friend when tapped. */
  isWaiting: boolean;

  onSelectPlayer: (userId: string) => void;
};
