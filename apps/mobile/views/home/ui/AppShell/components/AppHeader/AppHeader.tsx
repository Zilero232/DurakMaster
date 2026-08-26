import { LogOut, Settings } from 'lucide-react-native';
import { useTranslation } from 'react-i18next';
import { Alert, Pressable, Text, View } from 'react-native';
import { match } from 'ts-pattern';

import { useSessionStore } from '@/entities/session';
import { logout } from '@/shared/api';
import { colors, iconSize } from '@/ui-kit';

import type { AppHeaderProps } from './AppHeader.types';

import { styles } from './AppHeader.styles';

export const AppHeader = ({ tab, status, onOpenSettings }: AppHeaderProps) => {
  const { t } = useTranslation();

  const disconnect = useSessionStore((store) => store.disconnect);

  const title = match(tab)
    .with('profile', () => t('nav.profile'))
    .with('tables', () => t('lobby.title'))
    .with('create', () => t('create.title'))
    .exhaustive();

  const handleLogout = () => {
    Alert.alert(t('auth.signOutTitle'), t('auth.signOutConfirm'), [
      { text: t('common.cancel'), style: 'cancel' },
      {
        text: t('auth.signOut'),
        style: 'destructive',
        onPress: () => {
          disconnect();
          void logout();
        }
      }
    ]);
  };

  return (
    <View style={styles.root}>
      <Text numberOfLines={1} style={styles.title}>
        {title}
      </Text>

      <View style={styles.actions}>
        {status !== 'connected' && (
          <Text numberOfLines={1} style={styles.status}>
            {status === 'connecting' ? t('connection.connecting') : t('connection.offline')}
          </Text>
        )}

        <Pressable
          accessibilityLabel={t('settings.title')}
          accessibilityRole='button'
          hitSlop={8}
          style={styles.iconButton}
          onPress={onOpenSettings}
        >
          <Settings color={colors.onFelt} size={iconSize.md} />
        </Pressable>

        <Pressable
          accessibilityLabel={t('auth.signOut')}
          accessibilityRole='button'
          hitSlop={8}
          style={styles.iconButton}
          onPress={handleLogout}
        >
          <LogOut color={colors.onFelt} size={iconSize.md} />
        </Pressable>
      </View>
    </View>
  );
};
