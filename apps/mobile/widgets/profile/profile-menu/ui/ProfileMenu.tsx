import {
  Award,
  BookOpen,
  Gift,
  Newspaper,
  Play,
  Settings,
  Share2,
  UserRound,
  Users
} from 'lucide-react-native';
import { useTranslation } from 'react-i18next';
import { Pressable, Text, View } from 'react-native';

import { haptic } from '@/shared/lib/haptics';
import { playSound } from '@/shared/lib/sound';
import { colors } from '@/ui-kit';

import type { ProfileMenuItem, ProfileMenuProps } from './ProfileMenu.types';

import { MenuTile } from './components';
import { styles } from './ProfileMenu.styles';

export const ProfileMenu = ({ onQuickGame, onOpenSettings, onOpenRules }: ProfileMenuProps) => {
  const { t } = useTranslation();

  const items: ProfileMenuItem[] = [
    { id: 'news', icon: Newspaper, isLocked: true },
    { id: 'friends', icon: Users, isLocked: true },
    { id: 'items', icon: Gift, isLocked: true },
    { id: 'leaderboard', icon: Award, isLocked: true },
    { id: 'achievements', icon: UserRound, isLocked: true },
    { id: 'settings', icon: Settings, onPress: onOpenSettings },
    { id: 'share', icon: Share2, isLocked: true },
    { id: 'rules', icon: BookOpen, onPress: onOpenRules }
  ];

  const handleQuickGame = () => {
    playSound('click');
    haptic('tap');
    onQuickGame();
  };

  return (
    <View style={styles.root}>
      <Pressable
        accessibilityRole='button'
        style={({ pressed }) => [styles.quickGame, pressed && styles.quickGamePressed]}
        onPress={handleQuickGame}
      >
        <Play color={colors.onFelt} fill={colors.onFelt} size={30} />

        <Text style={styles.quickGameLabel}>{t('menu.quickGame')}</Text>
      </Pressable>

      <View style={styles.grid}>
        {items.map(({ id, icon, badge, isLocked, onPress }) => (
          <MenuTile
            key={id}
            badge={badge}
            icon={icon}
            isLocked={isLocked}
            label={t(`menu.${id}`)}
            onPress={onPress}
          />
        ))}
      </View>
    </View>
  );
};
