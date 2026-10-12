import type { MyProfile } from '@durak-master/schemas';

import type { Chatter } from '@/entities/game-table';

export type MySeatProps = {
  profile: MyProfile | null;

  chatter?: Chatter;
  isMyTurn: boolean;
  turnDeadline: number | null;
  turnSeconds: number;
};
