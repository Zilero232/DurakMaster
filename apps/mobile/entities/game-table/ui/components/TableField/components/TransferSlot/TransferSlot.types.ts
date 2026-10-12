import type { DropZone } from '../../../../../model';

export type TransferSlotProps = {
  /** The slot right after the last pair, so a drop on it lands outside every pair. */
  index: number;
  width: number;
  height: number;
  isHovered: boolean;
  onMeasure: (zone: DropZone) => void;
  onPress: () => void;
};
