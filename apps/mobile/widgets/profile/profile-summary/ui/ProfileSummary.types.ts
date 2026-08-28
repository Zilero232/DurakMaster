import type { MyProfile } from '@durak-master/schemas';

export type ProfileSummaryProps = {
  profile: MyProfile;
  onOpenStats: () => void;
};
