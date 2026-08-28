import type { ViewForGame } from '@durak-master/schemas';

import type { CardScale } from '@/entities/settings';

export type TableCenterProps = {
  view: ViewForGame<'durak'>;
  beatableIndexes: Set<number>;

  cardScale: CardScale;
  mySeat: number;
  isInstant: boolean;

  hoveredIndex: number | null;
  onDefend: (pairIndex: number) => void;
};
