import type { Friend } from '@durak-master/schemas';

import type { FriendRowAction } from '../FriendRow';

export type FriendsTabProps = {
  friends: Friend[];

  canInvite: boolean;
  onAction: (action: FriendRowAction, userId: string) => void;

  onFind: () => void;
};
