import { useTranslation } from 'react-i18next';
import { Pressable, Text, View } from 'react-native';

import { colors } from '@/ui-kit';

import type { MenuTileProps } from './MenuTile.types';

import { styles } from './MenuTile.styles';

export const MenuTile = ({
  icon: Icon,
  label,
  badge,
  isLocked = false,
  onPress
}: MenuTileProps) => {
  const { t } = useTranslation();

  return (
    <Pressable
      style={({ pressed }) => [
        styles.root,
        pressed && !isLocked && styles.pressed,
        isLocked && styles.locked
      ]}
      accessibilityLabel={label}
      accessibilityRole='button'
      accessibilityState={{ disabled: isLocked }}
      disabled={isLocked}
      onPress={onPress}
    >
      <View style={styles.top}>
        <Icon color={colors.onFelt} size={22} />

        {badge && <Text style={styles.badge}>{badge}</Text>}
      </View>

      <Text numberOfLines={1} style={styles.label}>
        {label}
      </Text>

      {isLocked && <Text style={styles.soon}>{t('menu.soon')}</Text>}
    </Pressable>
  );
};
