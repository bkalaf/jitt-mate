import { Cell, Table, flexRender } from '@tanstack/react-table';

export function TableBodyCell({ table, cell }: { table: Table<any>; cell: Cell<any, unknown> }) {
    return (
        <td className='text-base font-medium border border-black font-open-sans'>
            <span className='flex w-full h-full'>{flexRender(cell.column.columnDef.cell, cell.getContext())}</span>
        </td>
    );
}
