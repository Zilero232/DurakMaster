import type { LucideIcon } from 'lucide-react-native';

export type WalletAmountProps = {
  icon: LucideIcon;
  iconColor: string;
  value: number;
  topUpLabel: string;
  onTopUp?: () => void;
};
