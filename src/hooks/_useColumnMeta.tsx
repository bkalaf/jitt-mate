import { Column, ColumnDef } from '@tanstack/react-table';
import { useMemo } from 'react';

/** @deprecated */
export function useColumnMeta<T>(column: Column<T, any> | ColumnDef<T, any>) {
    const meta = 'meta' in column ? column.meta : 'columnDef' in column ? column.columnDef.meta : undefined;
    if (meta == null) {
        console.error('no meta', column);
        throw new Error('meta null');
    }
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    return useMemo(() => meta, [meta]);
}
