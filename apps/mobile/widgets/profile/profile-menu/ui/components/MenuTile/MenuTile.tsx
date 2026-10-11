import { Pressable, Text, View } from 'react-native';

import { CountBadge, iconSize } from '@/ui-kit';

import type { MenuTileProps } from './MenuTile.types';

import { styles } from './MenuTile.styles';

export const MenuTile = ({
  icon: Icon,
  label,
  tint,
  badgeCount = 0,
  badgeTone,
  onPress
}: MenuTileProps) => (
  <Pressable
    accessibilityLabel={label}
    accessibilityRole='button'
    style={({ pressed }) => [styles.root, pressed && styles.pressed]}
    onPress={onPress}
  >
    <View style={styles.top}>
      <View style={[styles.halo, { backgroundColor: `${tint}22`, borderColor: `${tint}55` }]}>
        <Icon color={tint} size={iconSize.lg} />
      </View>

      <View style={styles.badge}>
        <CountBadge count={badgeCount} tone={badgeTone} />
      </View>
    </View>

    <Text numberOfLines={1} style={styles.label}>
      {label}
    </Text>
  </Pressable>
);
