import { ScrollView, View } from 'react-native';

import { useLayout } from '@/shared/model/layout';
import { ProfileMenu } from '@/widgets/profile/profile-menu';
import { ProfileSummary } from '@/widgets/profile/profile-summary';
import { WalletBar } from '@/widgets/profile/wallet-bar';

import type { ProfileTabProps } from './ProfileTab.types';

import { styles } from './ProfileTab.styles';

export const ProfileTab = ({
  profile,
  onClaimBonus,
  onOpenRules,
  onOpenSettings,
  onOpenStats,
  onOpenFriends,
  onOpenProfileEditor,
  onOpenAchievements,
  onOpenLeaderboard
}: ProfileTabProps) => {
  const { isDesktop } = useLayout();

  const wallet = (
    <WalletBar profile={profile} onClaimBonus={onClaimBonus} onEdit={onOpenProfileEditor} />
  );

  const summary = <ProfileSummary profile={profile} onOpenStats={onOpenStats} />;

  const menu = (
    <ProfileMenu
      onOpenAchievements={onOpenAchievements}
      onOpenFriends={onOpenFriends}
      onOpenLeaderboard={onOpenLeaderboard}
      onOpenRules={onOpenRules}
      onOpenSettings={onOpenSettings}
    />
  );

  return (
    <ScrollView
      contentContainerStyle={[styles.content, isDesktop && styles.columns]}
      showsVerticalScrollIndicator={false}
    >
      {isDesktop ? (
        <>
          <View style={styles.column}>
            {wallet}
            {summary}
          </View>

          <View style={styles.column}>{menu}</View>
        </>
      ) : (
        <>
          {wallet}
          {summary}
          {menu}
        </>
      )}
    </ScrollView>
  );
};
