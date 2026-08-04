import type { SuitIconProps } from './SuitIcon.types';

/**
 * Масть как иконка навигации.
 *
 * Пути нарисованы вручную: в lucide нет мастей, а тянуть ради четырёх
 * фигур целый шрифт или спрайт-лист неоправданно.
 */
const PATHS: Record<SuitIconProps['suit'], string> = {
  spades:
    'M12 2C12 2 4 8.5 4 13.5A4.5 4.5 0 0 0 8.5 18c1.2 0 2.3-.5 3-1.3-.2 2-1 3.6-2 4.3h5c-1-.7-1.8-2.3-2-4.3.7.8 1.8 1.3 3 1.3A4.5 4.5 0 0 0 20 13.5C20 8.5 12 2 12 2Z',
  hearts: 'M12 21s-8-5.2-8-11a4.6 4.6 0 0 1 8-3 4.6 4.6 0 0 1 8 3c0 5.8-8 11-8 11Z',
  diamonds: 'M12 2 21 12l-9 10-9-10 9-10Z',
  clubs:
    'M12 2a4 4 0 0 0-3.2 6.4A4 4 0 1 0 7.5 16c1.3 0 2.5-.6 3.2-1.6-.2 2.6-1 4.8-2.2 6.6h7c-1.2-1.8-2-4-2.2-6.6.7 1 1.9 1.6 3.2 1.6a4 4 0 1 0-1.3-7.6A4 4 0 0 0 12 2Z',
};

export const SuitIcon = ({ suit, size = 22, className }: SuitIconProps) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="currentColor"
    className={className}
    role="presentation"
    aria-hidden
  >
    <path d={PATHS[suit]} />
  </svg>
);
