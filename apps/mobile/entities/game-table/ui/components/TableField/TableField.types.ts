import type { TablePair } from '@durak-master/schemas';

import type { DropZone } from '../../../model';

export type TableFieldProps = {
  pairs: TablePair[];
  beatableIndexes: Set<number>;

  mySeat: number;

  isWaiting?: boolean;
  hoveredIndex?: number | null;
  isInstant?: boolean;
  onDefend: (pairIndex: number) => void;

  onZonesChange?: (zones: DropZone[]) => void;
};
