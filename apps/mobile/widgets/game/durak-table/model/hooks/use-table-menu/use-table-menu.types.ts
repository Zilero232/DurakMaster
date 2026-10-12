export type UseTableMenuInput = {
  /** During a deal leaving is a surrender, so the menu asks first. */
  isPlaying: boolean;
  onLeave: () => void;
};

export type TableMenuState = {
  isOpen: boolean;
  isConfirmingSurrender: boolean;
  open: () => void;
  close: () => void;
  requestLeave: () => void;
  confirmSurrender: () => void;
  cancelSurrender: () => void;
};
