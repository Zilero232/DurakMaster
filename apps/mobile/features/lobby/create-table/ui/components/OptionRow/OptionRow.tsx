import { Pressable, Text, View } from 'react-native';

import type { OptionRowProps } from './OptionRow.types';

import { styles } from './OptionRow.styles';

export const OptionRow = <T extends number | string>({
  items,
  value,
  onChange
}: OptionRowProps<T>) => (
  <View accessibilityRole='radiogroup' style={styles.root}>
    {items.map((item) => {
      const isActive = item.value === value;

      return (
        <Pressable
          key={item.value}
          accessibilityLabel={item.label}
          accessibilityRole='radio'
          accessibilityState={{ checked: isActive }}
          style={[styles.option, isActive && styles.optionActive]}
          onPress={() => onChange(item.value)}
        >
          <Text
            style={[
              styles.label,
              item.hint !== undefined && styles.labelWithHint,
              isActive && styles.labelActive
            ]}
            numberOfLines={1}
          >
            {item.label}
          </Text>

          {item.hint && (
            <Text numberOfLines={1} style={styles.hint}>
              {item.hint}
            </Text>
          )}
        </Pressable>
      );
    })}
  </View>
);
