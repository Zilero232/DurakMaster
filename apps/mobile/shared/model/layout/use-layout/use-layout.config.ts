import type { Breakpoint } from '../breakpoints';

export const SIZES = [
  'desktop',
  'wide',
  'medium',
  'compact'
] as const satisfies readonly Breakpoint[];
