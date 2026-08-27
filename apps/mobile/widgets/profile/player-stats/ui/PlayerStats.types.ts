import type { MyProfile } from '@durak-master/schemas';

export type PlayerStatsProps = {
  profile: MyProfile;
  isOpen: boolean;
  onClose: () => void;
};
