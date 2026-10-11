import type { PublicProfile } from '@durak-master/schemas';

export type FriendRowAction = 'accept' | 'add' | 'decline' | 'invite' | 'invited' | 'remove';

export type FriendRowProps<Action extends FriendRowAction> = {
  profile: PublicProfile;
  isOnline?: boolean;

  tableId?: string | null;
  actions: Action[];
  onAction: (action: Action, userId: string) => void;
};
