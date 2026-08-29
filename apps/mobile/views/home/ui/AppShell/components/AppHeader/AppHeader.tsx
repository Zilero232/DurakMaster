import { LogOut } from 'lucide-react-native';
import { useTranslation } from 'react-i18next';
import { Pressable, Text, View } from 'react-native';
import { match } from 'ts-pattern';

import { LanguageSwitch } from '@/shared/i18n';
import { colors, iconSize } from '@/ui-kit';

import type { AppHeaderProps } from './AppHeader.types';

import { styles } from './AppHeader.styles';

export const AppHeader = ({ tab, status, onSignOut }: AppHeaderProps) => {
  const { t } = useTranslation();

  const title = match(tab)
    .with('profile', () => t('nav.profile'))
    .with('tables', () => t('lobby.title'))
    .with('create', () => t('create.title'))
    .exhaustive();

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

        <LanguageSwitch />

        <Pressable
          accessibilityLabel={t('auth.signOut')}
          accessibilityRole='button'
          hitSlop={8}
          style={styles.iconButton}
          onPress={onSignOut}
        >
          <LogOut color={colors.onFelt} size={iconSize.md} />
        </Pressable>
      </View>
    </View>
  );
};
