import { Table } from '@tanstack/react-table';
import { createContext } from 'react';

export type ITableControlsContext<T extends EntityBase = EntityBase> = {
    getTable: () => Table<T> | null;
    setTable: StateSetter<Table<T> | null>;
    hasTable: () => boolean;
    rerender: () => void;
};

export const TableControlsContext = createContext<ITableControlsContext | undefined>(undefined);
TableControlsContext.displayName = 'TableControlsContext';
