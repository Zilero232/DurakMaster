import { LinearGradient } from 'expo-linear-gradient';
import { Pressable, Text, View } from 'react-native';
import { isNonNullish } from 'remeda';

import type { ButtonProps } from './Button.types';

import { gradientEnds, iconSize } from '../../theme';
import { Spinner } from '../Spinner';
import { SIZE_HIT_SLOP } from './Button.config';
import {
  SIZE_STYLES,
  styles,
  VARIANT_FOREGROUND,
  VARIANT_GRADIENT,
  VARIANT_STYLES
} from './Button.styles';
import { usePressFeedback } from './feedback-context';

export const Button = ({
  children,
  icon,
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
  const gradient = VARIANT_GRADIENT[variant];

  const feedback = usePressFeedback();

  const isBlocked = isDisabled || isLoading;

  const foreground = VARIANT_FOREGROUND[variant];

  const isIconOnly = isNonNullish(icon) && !children;

  const handlePress = () => {
    feedback();
    onPress?.();
  };

  return (
    <Pressable
      style={({ pressed }) => [
        styles.root,
        variantStyle.container,
        isIconOnly ? sizeStyle.iconOnly : sizeStyle.container,
        isFullWidth && styles.fullWidth,
        pressed && styles.pressed,
        isBlocked && styles.disabled,
        style
      ]}
      accessibilityLabel={accessibilityLabel}
      accessibilityRole='button'
      accessibilityState={{ busy: isLoading, disabled: isBlocked }}
      disabled={isBlocked}
      hitSlop={SIZE_HIT_SLOP[size]}
      onPress={handlePress}
    >
      {gradient && (
        <>
          <LinearGradient
            colors={gradient}
            end={gradientEnds.vertical.end}
            start={gradientEnds.vertical.start}
            style={styles.fill}
          />

          <View pointerEvents='none' style={styles.sheen} />
        </>
      )}

      {isLoading ? (
        <Spinner color={foreground} size={iconSize.md} />
      ) : (
        <View style={styles.content}>
          {icon?.(foreground)}

          {typeof children === 'string' ? (
            <Text numberOfLines={1} style={[styles.label, variantStyle.label, sizeStyle.label]}>
              {children}
            </Text>
          ) : (
            children
          )}
        </View>
      )}
    </Pressable>
  );
};
