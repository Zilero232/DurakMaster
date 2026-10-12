import { LinearGradient } from 'expo-linear-gradient';
import { Pressable, Text, View } from 'react-native';

import type { SegmentedControlProps } from './SegmentedControl.types';

import { gradientEnds, surfaceGradient } from '../../theme';
import { PAIR_FROM_OPTIONS } from './SegmentedControl.config';
import { styles } from './SegmentedControl.styles';

export const SegmentedControl = <T extends number | string>({
  options,
  value,
  accessibilityLabel,
  style,
  onChange
}: SegmentedControlProps<T>) => {
  const isPaired = options.length >= PAIR_FROM_OPTIONS;

  return (
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
            style={[
              styles.option,
              isPaired ? styles.pair : styles.single,
              isActive && styles.optionActive
            ]}
            accessibilityRole='radio'
            accessibilityState={{ checked: isActive }}
            onPress={() => onChange(option.value)}
          >
            {isActive && (
              <LinearGradient
                colors={surfaceGradient.accent}
                end={gradientEnds.vertical.end}
                start={gradientEnds.vertical.start}
                style={styles.fill}
              />
            )}

            <Text numberOfLines={1} style={[styles.label, isActive && styles.labelActive]}>
              {option.label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
};
