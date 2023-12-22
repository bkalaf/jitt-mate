import { useOnBlurContext } from './useOnBlurContext';
import { MRT_ColumnDef } from 'material-react-table';
import { useMemo } from 'react';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function useColumnDef(props: { column: Parameters<Exclude<MRT_ColumnDef<any, any>['Edit'], undefined>>[0]['column'] }) {
    const header = props.column.columnDef.header;
    const name = props.column.columnDef.accessorKey ?? props.column.columnDef.id;
    const createOnBlur = useOnBlurContext();
    return {
        name,
        header,
        onBlur: useMemo(() => createOnBlur(name), [createOnBlur, name])
    };
}
