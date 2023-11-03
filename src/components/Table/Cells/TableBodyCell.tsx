import { Cell, Table, flexRender } from '@tanstack/react-table';
import { TableCell } from '../TableCell';

export function TableBodyCell({ table, cell }: { table: Table<any>; cell: Cell<any, unknown> }) {
    const cn =
        cell.column.columnDef.id === 'expandRow' || cell.column.columnDef.id === 'deleteRow' || cell.column.columnDef.id === 'selectRow' ? 'items-center justify-center' : 'items-center justify-start';
    return <TableCell className={cn}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</TableCell>;
}

