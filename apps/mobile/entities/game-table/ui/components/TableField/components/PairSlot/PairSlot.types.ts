import type { TablePair } from '@durak-master/schemas';

import type { DropZone } from '../../../../../model';

export type PairSlotProps = {
  pair: TablePair;
  index: number;
  canBeat: boolean;
  isHovered: boolean;

  width: number;
  height: number;

  mySeat: number;

  isInstant?: boolean;
  onDefend: (pairIndex: number) => void;
  onMeasure: (zone: DropZone) => void;
};
