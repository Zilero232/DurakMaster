import type { TablePair } from '@durak-master/schemas';

export type TableFieldProps = {
  pairs: TablePair[];
  beatableIndexes: Set<number>;
  onDefend: (pairIndex: number) => void;
};
