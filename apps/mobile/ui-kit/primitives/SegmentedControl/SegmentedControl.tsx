import { Pressable, Text, View } from 'react-native';

import type { SegmentedControlProps } from './SegmentedControl.types';

import { styles } from './SegmentedControl.styles';

export const SegmentedControl = <T extends number | string>({
  options,
  value,
  accessibilityLabel,
  style,
  onChange
}: SegmentedControlProps<T>) => (
  <View
    accessibilityLabel={accessibilityLabel}
    accessibilityRole='radiogroup'
    style={[styles.root, style]}
  >
    {options.map((option) => {
      const isActive = option.value === value;

      return (
        <Pressable
          key={option.value}
          accessibilityRole='radio'
          accessibilityState={{ checked: isActive }}
          style={[styles.option, isActive && styles.optionActive]}
          onPress={() => onChange(option.value)}
        >
          <Text numberOfLines={1} style={[styles.label, isActive && styles.labelActive]}>
            {option.label}
          </Text>
        </Pressable>
      );
    })}
  </View>
);
