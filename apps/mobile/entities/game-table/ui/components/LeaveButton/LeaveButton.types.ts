export type LeaveButtonProps = {
  /** During a deal leaving is a surrender, so the button asks first. */
  isPlaying?: boolean;
  isConfirming: boolean;
  onPress: () => void;
  onCancel: () => void;
  onConfirm: () => void;
};
