import type { PlayerState } from '@durak-master/schemas';

export type OpponentSeatProps = {
  player: PlayerState;
  name: string;
  avatarUrl?: string | null;
  phrase?: string;
  isAttacker: boolean;
  isDefender: boolean;
  isActive: boolean;
};
