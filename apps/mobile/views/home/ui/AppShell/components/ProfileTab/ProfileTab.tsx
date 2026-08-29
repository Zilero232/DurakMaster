import { ScrollView, View } from 'react-native';

import { useMyProfile } from '@/entities/session';
import { useLayout } from '@/shared/model/layout';
import { ProfileMenu } from '@/widgets/profile/profile-menu';
import { ProfileSummary } from '@/widgets/profile/profile-summary';
import { WalletBar } from '@/widgets/profile/wallet-bar';

import type { ProfileTabProps } from './ProfileTab.types';

import { styles } from './ProfileTab.styles';

export const ProfileTab = ({ profile, onOpenPanel }: ProfileTabProps) => {
  const { isDesktop } = useLayout();

  const { claimBonus } = useMyProfile();

  if (!profile) {
    return null;
  }

  const wallet = (
    <WalletBar
      profile={profile}
      onClaimBonus={claimBonus}
      onEdit={() => onOpenPanel('profileEditor')}
    />
  );

  const summary = <ProfileSummary profile={profile} onOpenStats={() => onOpenPanel('stats')} />;

  const menu = <ProfileMenu onOpenPanel={onOpenPanel} />;

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
