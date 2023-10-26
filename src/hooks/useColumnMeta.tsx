import { Column } from '@tanstack/react-table';
import { useMemo } from 'react';

export function useColumnMeta<T>(column: Column<T, any>) {
    if (column.columnDef.meta == null) throw new Error('meta null');
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    return useMemo(() => column.columnDef.meta!, [column.columnDef.meta]);
}
