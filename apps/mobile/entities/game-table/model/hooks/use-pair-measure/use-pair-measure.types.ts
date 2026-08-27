import type { DropZone } from '../../drop-zone';

export type UsePairMeasureInput = {
  index: number;
  width: number;
  height: number;
  hasDefense: boolean;
  onMeasure: (zone: DropZone) => void;
};
