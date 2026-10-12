import { Coins, Wallet } from 'lucide-react-native';
import { useTranslation } from 'react-i18next';
import { Pressable, View } from 'react-native';

import { ConnectionPill } from '@/entities/session';
import { Avatar, colors } from '@/ui-kit';

import type { AppHeaderProps } from './AppHeader.types';

import { AVATAR_SIZE, styles } from './AppHeader.styles';
import { BalanceChip } from './components';

export const AppHeader = ({ profile, status, onOpenProfile }: AppHeaderProps) => {
  const { t } = useTranslation();

  return (
    <View style={styles.root}>
      <Pressable
        accessibilityLabel={t('nav.profile')}
        accessibilityRole='button'
        style={({ pressed }) => [styles.avatarButton, pressed && styles.avatarPressed]}
        onPress={onOpenProfile}
      >
        {profile !== null && (
          <Avatar
            name={profile.name}
            size={AVATAR_SIZE}
            src={profile.avatarUrl}
            style={styles.avatarRing}
          />
        )}
      </Pressable>

      <View style={styles.middle}>
        <ConnectionPill status={status} />
      </View>

      {profile !== null && (
        <View style={styles.balances}>
          <BalanceChip
            accessibilityLabel={t('profile.coins', { value: profile.coins })}
            icon={Coins}
            tint={colors.gold}
            value={profile.coins}
          />

          <BalanceChip
            accessibilityLabel={t('profile.credits', { value: profile.credits })}
            icon={Wallet}
            tint={colors.success}
            value={profile.credits}
          />
        </View>
      )}
    </View>
  );
};
