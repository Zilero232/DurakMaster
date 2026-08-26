import { Pressable, Text } from 'react-native';

import type { ButtonProps } from './Button.types';

import { usePressFeedback } from '../../lib';
import { SIZE_STYLES, styles, VARIANT_STYLES } from './Button.styles';

export const Button = ({
  children,
  variant = 'secondary',
  size = 'default',
  isFullWidth = false,
  isDisabled = false,
  accessibilityLabel,
  style,
  onPress
}: ButtonProps) => {
  const variantStyle = VARIANT_STYLES[variant];
  const sizeStyle = SIZE_STYLES[size];

  const feedback = usePressFeedback();

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
        isDisabled && styles.disabled,
        style
      ]}
      accessibilityLabel={accessibilityLabel}
      accessibilityRole='button'
      accessibilityState={{ disabled: isDisabled }}
      disabled={isDisabled}
      onPress={handlePress}
    >
      {typeof children === 'string' ? (
        <Text numberOfLines={1} style={[styles.label, variantStyle.label, sizeStyle.label]}>
          {children}
        </Text>
      ) : (
        children
      )}
    </Pressable>
  );
};
