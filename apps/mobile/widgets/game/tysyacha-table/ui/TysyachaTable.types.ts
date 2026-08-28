import type { TableSettings } from '@durak-master/schemas';

export type TysyachaTableProps = {
  settings: TableSettings;
  onLeave: () => void;
};
