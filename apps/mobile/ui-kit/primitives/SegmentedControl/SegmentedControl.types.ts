import type { StyleProp, ViewStyle } from 'react-native';

export type SegmentedOption<T extends number | string> = {
  value: T;
  label: string;
};

export type SegmentedControlProps<T extends number | string> = {
  options: SegmentedOption<T>[];
  value: T;
  accessibilityLabel?: string;
  style?: StyleProp<ViewStyle>;
  onChange: (value: T) => void;
};
