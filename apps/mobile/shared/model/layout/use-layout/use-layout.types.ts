import type { Breakpoint } from '../breakpoints';

export type LayoutInfo = {
  width: number;
  height: number;
  size: Breakpoint;

  isWide: boolean;
  isDesktop: boolean;
  isPortrait: boolean;
};
