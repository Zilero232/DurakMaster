export type EnterMotionInput = {
  /** How far the view travels before it settles, in pixels. Negative comes from above. */
  offsetY: number;
  durationMs: number;

  /** Skipped entirely when the player asked for instant animations. */
  isInstant?: boolean;
};
