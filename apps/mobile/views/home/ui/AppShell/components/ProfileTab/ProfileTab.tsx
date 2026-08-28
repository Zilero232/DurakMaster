import { ScrollView, View } from 'react-native';

import { useLayout } from '@/shared/model/layout';
import { ProfileMenu } from '@/widgets/profile/profile-menu';
import { ProfileSummary } from '@/widgets/profile/profile-summary';
import { WalletBar } from '@/widgets/profile/wallet-bar';

import type { ProfileTabProps } from './ProfileTab.types';

import { styles } from './ProfileTab.styles';

export const ProfileTab = ({ profile, onClaimBonus, onOpenPanel }: ProfileTabProps) => {
  const { isDesktop } = useLayout();

  const wallet = (
    <WalletBar
      profile={profile}
      onClaimBonus={onClaimBonus}
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
