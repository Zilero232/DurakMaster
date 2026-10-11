import type { DropZone } from '../../drop-zone';

export type UseCardGestureInput = {
  isPlayable: boolean;
  dropZones: DropZone[];
  onDropOn: (index: number) => void;

  onDropMiss: (travelY: number) => void;
  onPlay: () => void;
  onHover: (index: number | null) => void;
  onDragStart: () => void;
  onDragEnd: () => void;
};
