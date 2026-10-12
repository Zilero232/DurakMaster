import { Menu } from 'lucide-react-native';
import { useTranslation } from 'react-i18next';
import { Pressable, View } from 'react-native';

import { ConnectionPill, useSessionStore } from '@/entities/session';
import { colors, iconSize } from '@/ui-kit';

import type { TableTopBarProps } from './TableTopBar.types';

import { RulesStrip } from './components';
import { styles } from './TableTopBar.styles';

export const TableTopBar = ({ rules, onOpenMenu }: TableTopBarProps) => {
  const { t } = useTranslation();

  const status = useSessionStore((store) => store.status);

  return (
    <View style={styles.root}>
      <Pressable
        accessibilityLabel={t('table.menu')}
        accessibilityRole='button'
        style={({ pressed }) => [styles.menu, pressed && styles.pressed]}
        onPress={onOpenMenu}
      >
        <Menu color={colors.onFelt} size={iconSize.lg} />
      </Pressable>

      <RulesStrip rules={rules} onPress={onOpenMenu} />

      <ConnectionPill status={status} style={styles.connection} />
    </View>
  );
};
