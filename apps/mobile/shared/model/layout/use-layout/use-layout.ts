import { useWindowDimensions } from 'react-native';

import type { Breakpoint } from '../breakpoints';
import type { LayoutInfo } from './use-layout.types';

import { breakpoint } from '../breakpoints';
import { SIZES } from './use-layout.config';

const resolveSize = (width: number): Breakpoint =>
  SIZES.find((size) => width >= breakpoint[size]) ?? 'compact';

export const useLayout = (): LayoutInfo => {
  const { width, height } = useWindowDimensions();

  const size = resolveSize(width);

  return {
    width,
    height,
    size,
    isWide: width >= breakpoint.medium,
    isDesktop: width >= breakpoint.desktop,
    isPortrait: height >= width
  };
};
