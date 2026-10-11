import { useTranslation } from 'react-i18next';
import { Pressable, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { haptic } from '@/shared/lib/haptics';
import { playSound } from '@/shared/lib/sound';
import { colors, iconSize, SuitIcon } from '@/ui-kit';

import type { TabBarProps } from './TabBar.types';

import { TABS } from '../../AppShell.config';
import { BOTTOM_GAP, styles } from './TabBar.styles';

export const TabBar = ({ tab, onChange }: TabBarProps) => {
  const { t } = useTranslation();

  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.root, { paddingBottom: insets.bottom + BOTTOM_GAP }]}>
      {TABS.map(({ id, labelKey, suit }) => {
        const isActive = tab === id;

        return (
          <Pressable
            key={id}
            accessibilityRole='tab'
            accessibilityState={{ selected: isActive }}
            style={styles.item}
            onPress={() => {
              playSound('click');
              haptic('tap');
              onChange(id);
            }}
          >
            <SuitIcon
              color={isActive ? colors.gold : colors.onFeltMuted}
              size={iconSize.lg}
              suit={suit}
            />

            <Text numberOfLines={1} style={[styles.label, isActive && styles.labelActive]}>
              {t(labelKey)}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
};
