import type { Friend } from '@durak-master/schemas';

import type { ManageAction } from '../../FriendsPanel.types';

export type RequestsTabProps = {
  incoming: Friend[];
  outgoing: Friend[];
  onAction: (action: ManageAction, userId: string) => void;
};
