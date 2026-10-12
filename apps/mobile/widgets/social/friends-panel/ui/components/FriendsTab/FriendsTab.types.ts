import type { Friend } from '@durak-master/schemas';

import type { ManageAction } from '../../../model';

export type FriendsTabProps = {
  friends: Friend[];

  onAction: (action: ManageAction, userId: string) => void;

  onFind: () => void;
};
