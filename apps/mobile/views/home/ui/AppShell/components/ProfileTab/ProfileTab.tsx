import { ScrollView } from 'react-native';

import { useMyProfile } from '@/entities/session';
import { ProfileMenu } from '@/widgets/profile/profile-menu';
import { ProfileSummary } from '@/widgets/profile/profile-summary';
import { WalletBar } from '@/widgets/profile/wallet-bar';

import type { ProfileTabProps } from './ProfileTab.types';

import { styles } from './ProfileTab.styles';

export const ProfileTab = ({ profile, onOpenPanel }: ProfileTabProps) => {
  const { claimBonus } = useMyProfile();

  if (!profile) {
    return null;
  }

  return (
    <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
      <WalletBar
        profile={profile}
        onClaimBonus={claimBonus}
        onEdit={() => onOpenPanel('profileEditor')}
      />

      <ProfileSummary profile={profile} onOpenStats={() => onOpenPanel('stats')} />

      <ProfileMenu onOpenPanel={onOpenPanel} />
    </ScrollView>
  );
};
