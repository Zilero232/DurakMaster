import type { PublicProfile, ViewForGame } from '@durak-master/schemas';

import type { Chatter } from '@/entities/game-table';

export type OpponentsRowProps = {
  view: ViewForGame<'durak'>;
  players: PublicProfile[];
  mySeat: number;
  phrases: Record<string, Chatter>;

  turnSeconds: number;

  loserUserId?: string | null;
  onSelectPlayer?: (userId: string) => void;
};
