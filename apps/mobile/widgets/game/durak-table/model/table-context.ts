import { createContext, use } from 'react';

import type { TableContextValue } from './table-context.types';

import { EMPTY_TABLE_CONTEXT } from './table-context.config';

const TableContext = createContext<TableContextValue>(EMPTY_TABLE_CONTEXT);

export const TableProvider = TableContext.Provider;

export const useTableContext = (): TableContextValue => use(TableContext);
