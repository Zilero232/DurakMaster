import type { ReactNode } from 'react';
import type { StyleProp, ViewStyle } from 'react-native';

export type ButtonVariant = 'danger' | 'ghost' | 'primary' | 'secondary';
export type ButtonSize = 'default' | 'lg' | 'sm';

export type ButtonProps = {
  children?: ReactNode;

  /** Sits before the label, and stands in for it when there is no label. */
  icon?: (color: string) => ReactNode;
  variant?: ButtonVariant;
  size?: ButtonSize;
  isFullWidth?: boolean;
  isDisabled?: boolean;

  isLoading?: boolean;
  accessibilityLabel?: string;

  style?: StyleProp<ViewStyle>;
  onPress?: () => void;
};
