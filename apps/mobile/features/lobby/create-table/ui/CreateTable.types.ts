import type { TableSettings } from '@durak-master/schemas';

export type CreateTableProps = {
  isPending?: boolean;
  onCreate: (settings: TableSettings, password?: string) => void;
};
