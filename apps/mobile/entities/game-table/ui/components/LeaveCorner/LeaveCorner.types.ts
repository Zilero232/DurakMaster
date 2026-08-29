export type LeaveCornerProps = {
  /** During a deal leaving is a surrender, so the button asks first. */
  isPlaying?: boolean;
  onLeave: () => void;
};
