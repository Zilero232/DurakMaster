import type { MyProfile } from '@durak-master/schemas';

export type WalletBarProps = {
  profile: MyProfile;
  onClaimBonus?: () => void;
  onTopUpCoins?: () => void;
  onTopUpCredits?: () => void;
};
