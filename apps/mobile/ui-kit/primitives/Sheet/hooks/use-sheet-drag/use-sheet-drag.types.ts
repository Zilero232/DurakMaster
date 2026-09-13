export type UseSheetDragInput = {
  isOpen: boolean;

  /** How far the sheet may travel before it counts as dismissed. */
  maxHeight: number;
  onClose: () => void;
};
