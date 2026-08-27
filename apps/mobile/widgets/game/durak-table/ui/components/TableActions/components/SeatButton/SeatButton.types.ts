import type { MyProfile } from '@durak-master/schemas';

import type { Chatter } from '@/entities/game-table';

export type SeatButtonProps = {
  profile: MyProfile | null;

  chatter?: Chatter;
  isMyTurn: boolean;
  isLoser?: boolean;
  turnDeadline: number | null;
  turnSeconds: number;
  onPress: () => void;
};
