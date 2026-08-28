import type { TableSettings } from '@durak-master/schemas';

export type BurkozelTableProps = {
  settings: TableSettings;
  onLeave: () => void;
};
