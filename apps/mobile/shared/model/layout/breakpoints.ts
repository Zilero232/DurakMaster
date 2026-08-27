export const breakpoint = {
  compact: 0,

  medium: 768,

  wide: 1024,

  desktop: 1280
} as const;

export type Breakpoint = keyof typeof breakpoint;
