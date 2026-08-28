import { Award, BookOpen, Settings, Share2, Trophy, Users } from 'lucide-react-native';
import { useTranslation } from 'react-i18next';
import { Share, View } from 'react-native';

import { colors } from '@/ui-kit';

import type { ProfileMenuItem, ProfileMenuProps } from './ProfileMenu.types';

import { MenuTile } from './components';
import { styles } from './ProfileMenu.styles';

export const ProfileMenu = ({
  onOpenRules,
  onOpenSettings,
  onOpenFriends,
  onOpenAchievements,
  onOpenLeaderboard
}: ProfileMenuProps) => {
  const { t } = useTranslation();

  const handleShare = () => {
    void Share.share({ message: t('menu.shareMessage') });
  };

  const items: ProfileMenuItem[] = [
    { id: 'friends', icon: Users, tint: colors.info, onPress: onOpenFriends },
    { id: 'achievements', icon: Award, tint: colors.gold, onPress: onOpenAchievements },
    { id: 'leaderboard', icon: Trophy, tint: colors.accentBright, onPress: onOpenLeaderboard },
    { id: 'rules', icon: BookOpen, tint: colors.mutedForeground, onPress: onOpenRules },
    { id: 'settings', icon: Settings, tint: colors.success, onPress: onOpenSettings },
    { id: 'share', icon: Share2, tint: colors.trump, onPress: handleShare }
  ];

  return (
    <View style={styles.grid}>
      {items.map(({ id, icon, badge, isLocked, tint, onPress }) => (
        <MenuTile
          key={id}
          badge={badge}
          icon={icon}
          isLocked={isLocked}
          label={t(`menu.${id}`)}
          tint={tint}
          onPress={onPress}
        />
      ))}
    </View>
  );
};
