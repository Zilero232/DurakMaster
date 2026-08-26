import { Pressable, Text, View } from 'react-native';

import { LOCALE_LABELS, LOCALES } from '@/shared/i18n';

import type { LocaleOptionsProps } from './LocaleOptions.types';

import { styles } from './LocaleOptions.styles';

export const LocaleOptions = ({ value, onChange }: LocaleOptionsProps) => (
  <View style={styles.root}>
    {LOCALES.map((locale) => {
      const isActive = locale === value;

      return (
        <Pressable
          key={locale}
          style={({ pressed }) => [
            styles.option,
            isActive && styles.active,
            pressed && styles.pressed
          ]}
          accessibilityRole='radio'
          accessibilityState={{ selected: isActive }}
          onPress={() => onChange(locale)}
        >
          <Text style={[styles.label, isActive && styles.activeLabel]}>
            {LOCALE_LABELS[locale]}
          </Text>
        </Pressable>
      );
    })}
  </View>
);
