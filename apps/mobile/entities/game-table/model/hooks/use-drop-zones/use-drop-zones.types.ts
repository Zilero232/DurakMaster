import type { DropZone } from '../../drop-zone';

export type UseDropZonesInput = {
  /** Zones for slots past this count are dropped as the table shrinks. */
  slotCount: number;
  onChange?: (zones: DropZone[]) => void;
};

export type UseDropZonesResult = {
  onMeasure: (zone: DropZone) => void;
};
