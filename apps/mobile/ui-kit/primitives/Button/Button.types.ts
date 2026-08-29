import type { ReactNode } from 'react';
import type { StyleProp, ViewStyle } from 'react-native';

export type ButtonVariant = 'danger' | 'ghost' | 'primary' | 'secondary';
export type ButtonSize = 'default' | 'lg' | 'sm';

export type ButtonProps = {
  children: ReactNode;
  variant?: ButtonVariant;
  size?: ButtonSize;
  isFullWidth?: boolean;
  isDisabled?: boolean;

  isLoading?: boolean;
  accessibilityLabel?: string;

  /** Stable hook for end-to-end tests; labels move with the locale, this does not. */
  testID?: string;
  style?: StyleProp<ViewStyle>;
  onPress?: () => void;
};
