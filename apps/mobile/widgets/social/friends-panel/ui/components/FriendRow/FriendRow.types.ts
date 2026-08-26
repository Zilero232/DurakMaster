import type { PublicProfile } from '@durak-master/schemas';

export type FriendRowAction = 'accept' | 'add' | 'decline' | 'invite' | 'remove';

export type FriendRowProps = {
  profile: PublicProfile;
  isOnline?: boolean;

  tableId?: string | null;
  actions: FriendRowAction[];
  onAction: (action: FriendRowAction, userId: string) => void;
};
