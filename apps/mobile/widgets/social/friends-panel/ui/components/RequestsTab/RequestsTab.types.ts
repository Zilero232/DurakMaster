import type { Friend } from '@durak-master/schemas';

import type { FriendRowAction } from '../FriendRow';

export type RequestsTabProps = {
  incoming: Friend[];
  outgoing: Friend[];
  onAction: (action: FriendRowAction, userId: string) => void;
};
