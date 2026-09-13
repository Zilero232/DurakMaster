import type { toTableSettings } from '../../create-table-form';

export type UseCreateTableFormInput = {
  onCreate: (settings: ReturnType<typeof toTableSettings>, password?: string) => void;
};
