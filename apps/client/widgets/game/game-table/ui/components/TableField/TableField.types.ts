import type { TablePair } from '@durak-master/schemas';

export type TableFieldProps = {
  pairs: TablePair[];
  /** Индексы пар, которые можно отбить выбранной картой. */
  beatableIndexes: Set<number>;
  onDefend: (pairIndex: number) => void;
};
