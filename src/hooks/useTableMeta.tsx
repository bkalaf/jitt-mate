import { Table } from '@tanstack/react-table';

export function useTableMeta<T>(table: Table<T>) {
    if (table.options.meta == null) throw new Error('no table meta');
    return table.options.meta;
}
