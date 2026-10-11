import type { PublicProfile } from '@durak-master/schemas';

import type { ManageAction } from '../../FriendsPanel.types';

export type SearchTabProps = {
  found: PublicProfile[];
  onSearch: (query: string) => void;
  onAction: (action: ManageAction, userId: string) => void;
};
