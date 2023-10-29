import { Table } from '@tanstack/react-table';
import { createContext, useCallback, useReducer, useRef, useState } from 'react';

export type ITableControlsContext<T extends EntityBase = EntityBase> = {
    getTable: () => Table<T> | null;
    setTable: StateSetter<Table<T> | null>;
    hasTable: () => boolean;
    rerender: () => void;
};

export const TableControlsContext = createContext<ITableControlsContext | undefined>(undefined);
TableControlsContext.displayName = 'TableControlsContext';

export function useProvideTableControlsContext<T extends EntityBase = EntityBase>(): ITableControlsContext<T> {
    const rerender = useReducer(() => ({}), {})[1];
    const [table, setTable] = useState<Table<T> | null>(null);
    const getTable =  useCallback(() => {
        console.log(`getting table`);
        return table;
    }, [table])
    const hasTable = useCallback(() => table != null, [table])
    return {
        getTable,
        rerender,
        setTable,
        hasTable
    }
}

export function TableControlsProvider<T extends EntityBase = EntityBase>({ children }: { children: Children }) {
    const context = useProvideTableControlsContext<T>();
    return <TableControlsContext.Provider value={context as any}>
        {children}
    </TableControlsContext.Provider>
}