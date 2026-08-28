import type { Chatter } from '../../../SeatChatter';

export type SeatIdentityProps = {
  name: string;
  avatarUrl: string | null;

  isEmpty: boolean;
  isActive: boolean;
  isReady: boolean;
  isLoser: boolean;
  isAttacker: boolean;
  isDefender: boolean;
  isOut: boolean;
  isDisconnected: boolean;

  phrase?: Chatter;
  turnDeadline: number | null;
  turnSeconds: number;
};
