import type { TablePair } from '@durak-master/schemas';

import type { CardScale } from '@/shared/model/preferences';

import type { DropZone } from '../../../model';

export type TableFieldProps = {
  pairs: TablePair[];
  beatableIndexes: Set<number>;

  mySeat: number;

  hoveredIndex?: number | null;
  cardScale?: CardScale;
  isInstant?: boolean;
  onDefend: (pairIndex: number) => void;

  onZonesChange?: (zones: DropZone[]) => void;
};
