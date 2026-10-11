import type { Friend } from '@durak-master/schemas';

import type { ManageAction } from '../../FriendsPanel.types';

export type FriendsTabProps = {
  friends: Friend[];

  onAction: (action: ManageAction, userId: string) => void;

  onFind: () => void;
};
