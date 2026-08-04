import type { TableSettings } from '@durak-master/schemas';

export type CreateTableProps = {
  onCreate: (settings: TableSettings, password?: string) => void;
};
