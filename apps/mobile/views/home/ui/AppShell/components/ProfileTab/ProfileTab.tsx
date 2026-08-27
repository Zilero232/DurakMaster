import { ScrollView } from 'react-native';

import { ProfileMenu } from '@/widgets/profile/profile-menu';
import { WalletBar } from '@/widgets/profile/wallet-bar';

import type { ProfileTabProps } from './ProfileTab.types';

import { styles } from './ProfileTab.styles';

export const ProfileTab = ({
  profile,
  onClaimBonus,
  onOpenRules,
  onOpenStats,
  onOpenFriends,
  onOpenProfileEditor,
  onOpenAchievements,
  onOpenLeaderboard
}: ProfileTabProps) => (
  <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
    <WalletBar profile={profile} onClaimBonus={onClaimBonus} onEdit={onOpenProfileEditor} />

    <ProfileMenu
      onOpenAchievements={onOpenAchievements}
      onOpenFriends={onOpenFriends}
      onOpenLeaderboard={onOpenLeaderboard}
      onOpenRules={onOpenRules}
      onOpenStats={onOpenStats}
    />
  </ScrollView>
);
