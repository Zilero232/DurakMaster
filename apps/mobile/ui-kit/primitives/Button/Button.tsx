import { Pressable, Text } from 'react-native';

import type { ButtonProps } from './Button.types';

import { iconSize } from '../../theme';
import { Spinner } from '../Spinner';
import { SIZE_STYLES, styles, VARIANT_SPINNER_COLOR, VARIANT_STYLES } from './Button.styles';
import { usePressFeedback } from './feedback-context';

export const Button = ({
  children,
  variant = 'secondary',
  size = 'default',
  isFullWidth = false,
  isDisabled = false,
  isLoading = false,
  accessibilityLabel,
  style,
  onPress
}: ButtonProps) => {
  const variantStyle = VARIANT_STYLES[variant];
  const sizeStyle = SIZE_STYLES[size];

  const feedback = usePressFeedback();

  const isBlocked = isDisabled || isLoading;

  const handlePress = () => {
    feedback();
    onPress?.();
  };

  return (
    <Pressable
      style={({ pressed }) => [
        styles.root,
        variantStyle.container,
        sizeStyle.container,
        isFullWidth && styles.fullWidth,
        pressed && styles.pressed,
        isBlocked && styles.disabled,
        style
      ]}
      accessibilityLabel={accessibilityLabel}
      accessibilityRole='button'
      accessibilityState={{ busy: isLoading, disabled: isBlocked }}
      disabled={isBlocked}
      onPress={handlePress}
    >
      {isLoading ? (
        <Spinner color={VARIANT_SPINNER_COLOR[variant]} size={iconSize.md} />
      ) : typeof children === 'string' ? (
        <Text numberOfLines={1} style={[styles.label, variantStyle.label, sizeStyle.label]}>
          {children}
        </Text>
      ) : (
        children
      )}
    </Pressable>
  );
};
