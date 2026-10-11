import type { ViewForGame } from '@durak-master/schemas';

export type TableCenterProps = {
  view: ViewForGame<'durak'>;
  beatableIndexes: Set<number>;

  mySeat: number;
  isInstant: boolean;

  hoveredIndex: number | null;
  onDefend: (pairIndex: number) => void;
};
