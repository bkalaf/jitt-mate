import { Cell, Table, flexRender } from '@tanstack/react-table';
import { TableCell } from './TableCell';

export function TableBodyCell({ table, cell }: { table: Table<any>; cell: Cell<any, unknown> }) {
    return <TableCell>{flexRender(cell.column.columnDef.cell, cell.getContext())}</TableCell>;
}

