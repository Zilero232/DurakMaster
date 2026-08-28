import type { MyProfile } from '@durak-master/schemas';

import type { ShellPanel } from '../../../../model';

export type ProfileTabProps = {
  profile: MyProfile;
  onClaimBonus: () => void;
  onOpenPanel: (panel: ShellPanel) => void;
};
