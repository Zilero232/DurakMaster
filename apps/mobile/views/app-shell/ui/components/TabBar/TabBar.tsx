import { useTranslation } from 'react-i18next';
import { Pressable, Text, View } from 'react-native';

import { haptic } from '@/shared/lib/haptics';
import { playSound } from '@/shared/lib/sound';
import { colors, SuitIcon } from '@/ui-kit';

import type { TabBarProps } from './TabBar.types';

import { TABS } from './TabBar.config';
import { styles } from './TabBar.styles';

export const TabBar = ({ tab, onChange }: TabBarProps) => {
  const { t } = useTranslation();

  return (
    <View style={styles.root}>
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
            <SuitIcon color={isActive ? colors.gold : colors.onFeltMuted} size={26} suit={suit} />

            <Text numberOfLines={1} style={[styles.label, isActive && styles.labelActive]}>
              {t(labelKey)}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
};
