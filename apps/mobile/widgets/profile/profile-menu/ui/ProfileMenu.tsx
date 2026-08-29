import { useTranslation } from 'react-i18next';
import { Share, View } from 'react-native';

import { useAchievements, useFriends } from '@/entities/social';

import type { ProfileMenuProps } from './ProfileMenu.types';

import { MenuTile } from './components';
import { PROFILE_MENU_ITEMS } from './ProfileMenu.config';
import { styles } from './ProfileMenu.styles';

export const ProfileMenu = ({ onOpenPanel }: ProfileMenuProps) => {
  const { t } = useTranslation();

  const { friends } = useFriends();
  const { achievements } = useAchievements();

  const claimable = achievements.filter(
    (entry) => entry.unlockedAt !== null && entry.claimedAt === null
  ).length;

  const badgeCounts = {
    friends: friends.incoming.length,
    achievements: claimable
  };

  const handleShare = () => {
    void Share.share({ message: t('menu.shareMessage') });
  };

  return (
    <View style={styles.grid}>
      {PROFILE_MENU_ITEMS.map(({ id, icon, badgeTone, isLocked, tint }) => (
        <MenuTile
          key={id}
          badgeCount={badgeCounts[id as keyof typeof badgeCounts] ?? 0}
          badgeTone={badgeTone}
          icon={icon}
          isLocked={isLocked}
          label={t(`menu.${id}`)}
          tint={tint}
          onPress={id === 'share' ? handleShare : () => onOpenPanel(id)}
        />
      ))}
    </View>
  );
};
