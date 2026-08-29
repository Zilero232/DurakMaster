import { LogOut } from 'lucide-react-native';
import { useTranslation } from 'react-i18next';
import { Pressable, Text, View } from 'react-native';

import { TEST_ID } from '@/shared/config';
import { LanguageSwitch } from '@/shared/i18n';
import { colors, iconSize } from '@/ui-kit';

import type { SideRailProps } from './SideRail.types';

import { TABS } from '../../AppShell.config';
import { RailItem } from './components';
import { styles } from './SideRail.styles';

export const SideRail = ({ tab, status, onChange, onSignOut }: SideRailProps) => {
  const { t } = useTranslation();

  return (
    <View accessibilityRole='tablist' style={styles.root}>
      <View style={styles.brand}>
        <Text style={styles.brandName}>{t('common.appName')}</Text>
        <Text style={styles.brandSubtitle}>{t('common.appSubtitle')}</Text>
      </View>

      <View style={styles.nav}>
        {TABS.map(({ id, labelKey, suit }) => (
          <RailItem
            key={id}
            isActive={tab === id}
            label={t(labelKey)}
            suit={suit}
            testID={TEST_ID.nav.tab(id)}
            onPress={() => onChange(id)}
          />
        ))}
      </View>

      <View style={styles.footer}>
        {status !== 'connected' && (
          <Text numberOfLines={1} style={styles.status}>
            {status === 'connecting' ? t('connection.connecting') : t('connection.offline')}
          </Text>
        )}

        <View style={styles.footerRow}>
          <Pressable
            accessibilityRole='button'
            style={({ pressed }) => [styles.signOut, pressed && styles.signOutPressed]}
            onPress={onSignOut}
          >
            <LogOut color={colors.onFelt} size={iconSize.md} />

            <Text style={styles.signOutLabel}>{t('auth.signOut')}</Text>
          </Pressable>

          <LanguageSwitch isSquared />
        </View>
      </View>
    </View>
  );
};
