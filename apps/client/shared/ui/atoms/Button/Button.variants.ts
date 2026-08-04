import { cva, type VariantProps } from 'class-variance-authority';

import s from './Button.module.scss';

export const buttonVariants = cva(s.root, {
  variants: {
    variant: {
      primary: s.primary,
      secondary: s.secondary,
      ghost: s.ghost,
      danger: s.danger,
    },
    size: {
      sm: s.sizeSm,
      default: s.sizeDefault,
      lg: s.sizeLg,
      icon: s.sizeIcon,
    },
    isFullWidth: {
      true: s.fullWidth,
    },
  },
  defaultVariants: {
    variant: 'secondary',
    size: 'default',
  },
});

export type ButtonVariantProps = VariantProps<typeof buttonVariants>;
