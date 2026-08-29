import { useWindowDimensions } from 'react-native';

import type { Breakpoint } from './breakpoints';

import { breakpoint } from './breakpoints';

export type LayoutInfo = {
  width: number;
  height: number;
  size: Breakpoint;

  isWide: boolean;

  isDesktop: boolean;

  isPortrait: boolean;
};

const SIZES = ['desktop', 'wide', 'medium', 'compact'] as const satisfies readonly Breakpoint[];

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
