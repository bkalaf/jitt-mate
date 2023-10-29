import { ColumnDef } from '@tanstack/table-core';


export const $primitiveColumns: Record<string, ColumnDef<any, any>[]> = {
    string: [{ id: 'value', accessorFn: (x: string) => x, header: 'Value', footer: 'value', cell: (props) => props.getValue<string>() }]
};
