import type { MyProfile } from '@durak-master/schemas';

export type SeatButtonProps = {
  profile: MyProfile | null;

  chatter?: string;
  isMyTurn: boolean;
  turnDeadline: number | null;
  turnSeconds: number;
  onPress: () => void;
};
