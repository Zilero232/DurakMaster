import type { TableSettings } from '@durak-master/schemas';

export type DurakTableProps = {
  settings: TableSettings;
  onLeave: () => void;
  onSelectPlayer: (userId: string) => void;
};
