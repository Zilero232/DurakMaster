import { LinearGradient } from 'expo-linear-gradient';
import { useState } from 'react';
import { Pressable, Text, View } from 'react-native';

import type { SegmentedControlProps } from './SegmentedControl.types';

import { gradientEnds, surfaceGradient } from '../../theme';
import { PAIR_FROM_OPTIONS, ROW_MIN_OPTION_WIDTH } from './SegmentedControl.config';
import { styles } from './SegmentedControl.styles';

export const SegmentedControl = <T extends number | string>({
  options,
  value,
  accessibilityLabel,
  style,
  onChange
}: SegmentedControlProps<T>) => {
  const [width, setWidth] = useState(0);

  const isCrowded = width > 0 && width < options.length * ROW_MIN_OPTION_WIDTH;

  const isPaired = isCrowded && options.length >= PAIR_FROM_OPTIONS;

  return (
    <View
      accessibilityLabel={accessibilityLabel}
      accessibilityRole='radiogroup'
      style={[styles.root, style]}
      onLayout={(event) => setWidth(event.nativeEvent.layout.width)}
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
