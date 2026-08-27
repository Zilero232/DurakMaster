export const breakpoint = {
  compact: 0,

  medium: 768,

  wide: 1024
} as const;

export type Breakpoint = keyof typeof breakpoint;
