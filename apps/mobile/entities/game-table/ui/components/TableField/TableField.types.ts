import type { TablePair } from '@durak-master/schemas';

import type { DropZone } from '../../../model';

export type TableFieldProps = {
  cardWidth: number;

  /** Exactly three pairs and their gaps, so the fourth pair wraps. */
  fieldWidth: number;
  pairs: TablePair[];
  beatableIndexes: Set<number>;

  mySeat: number;

  isWaiting?: boolean;

  /** Shows a drop slot after the pairs that takes a card to transfer the attack. */
  canTransfer?: boolean;
  hoveredIndex?: number | null;
  isInstant?: boolean;
  onDefend: (pairIndex: number) => void;
  onTransfer?: () => void;

  onZonesChange?: (zones: DropZone[]) => void;
};
