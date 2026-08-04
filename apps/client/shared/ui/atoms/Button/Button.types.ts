import type { ComponentProps } from 'react';
import type { ButtonVariantProps } from './Button.variants';

export type ButtonProps = Omit<ComponentProps<'button'>, 'color'> &
  ButtonVariantProps & {
    isDisabled?: boolean;
  };
