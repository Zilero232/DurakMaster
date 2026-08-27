import type { MyProfile } from '@durak-master/schemas';

export type WalletBarProps = {
  profile: MyProfile;

  onEdit: () => void;
  onClaimBonus?: () => void;
  onTopUpCoins?: () => void;
  onTopUpCredits?: () => void;
};
