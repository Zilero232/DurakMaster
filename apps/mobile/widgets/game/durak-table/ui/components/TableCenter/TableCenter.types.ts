import type { ViewForGame } from '@durak-master/schemas';

export type TableCenterProps = {
  view: ViewForGame<'durak'>;
  beatableIndexes: Set<number>;

  mySeat: number;
  isInstant: boolean;
  canTransfer: boolean;

  hoveredIndex: number | null;
  onDefend: (pairIndex: number) => void;
  onTransfer: () => void;
};
