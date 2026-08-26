import type { PublicProfile } from '@durak-master/schemas';

import type { FriendRowAction } from '../FriendRow';

export type SearchTabProps = {
  found: PublicProfile[];
  onSearch: (query: string) => void;
  onAction: (action: FriendRowAction, userId: string) => void;
};
