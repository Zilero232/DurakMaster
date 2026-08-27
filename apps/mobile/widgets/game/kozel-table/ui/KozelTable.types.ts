import type { TableSettings } from '@durak-master/schemas';

export type KozelTableProps = {
  settings: TableSettings;
  onLeave: () => void;
};
