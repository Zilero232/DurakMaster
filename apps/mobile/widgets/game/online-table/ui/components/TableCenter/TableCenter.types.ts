import type { ViewForGame } from '@durak-master/schemas';

import type { DropZone } from '@/entities/game-table';
import type { CardScale } from '@/entities/settings';

export type TableCenterProps = {
  view: ViewForGame<'durak'>;

  beatableIndexes: Set<number>;

  hoveredIndex: number | null;
  cardScale: CardScale;
  isInstant: boolean;
  onDefend: (pairIndex: number) => void;

  onZonesChange: (zones: DropZone[]) => void;
};
