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

export const useLayout = (): LayoutInfo => {
  const { width, height } = useWindowDimensions();

  const size: Breakpoint =
    width >= breakpoint.desktop
      ? 'desktop'
      : width >= breakpoint.wide
        ? 'wide'
        : width >= breakpoint.medium
          ? 'medium'
          : 'compact';

  return {
    width,
    height,
    size,
    isWide: width >= breakpoint.medium,
    isDesktop: width >= breakpoint.desktop,
    isPortrait: height >= width
  };
};
