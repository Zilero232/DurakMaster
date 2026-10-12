import type { PublicProfile } from '@durak-master/schemas';

import type { ManageAction } from '../../../model';

export type SearchTabProps = {
  found: PublicProfile[];
  onSearch: (query: string) => void;
  onAction: (action: ManageAction, userId: string) => void;
};
