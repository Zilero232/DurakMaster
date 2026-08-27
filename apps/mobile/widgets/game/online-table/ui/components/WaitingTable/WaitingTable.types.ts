import type { TableSettings } from '@durak-master/schemas';

export type WaitingTableProps = {
  settings: TableSettings;
  onLeave: () => void;
};
