import { buttonVariants } from './Button.variants';

import type { ButtonProps } from './Button.types';

export const Button = ({
  className,
  variant,
  size,
  isFullWidth,
  isDisabled,
  disabled,
  type = 'button',
  children,
  ...props
}: ButtonProps) => (
  <button
    data-size={size}
    data-slot="button"
    data-variant={variant}
    disabled={isDisabled ?? disabled}
    type={type}
    {...props}
    className={buttonVariants({ variant, size, isFullWidth, className })}
  >
    {children}
  </button>
);
