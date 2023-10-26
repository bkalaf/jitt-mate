import { Table, flexRender } from '@tanstack/react-table';
import { TableHeaderCell } from './TableHeaderCell';
import { TableRow } from './TableRow';

export function ReactTable<T extends EntityBase>({ table }: { table: Table<T>; }) {
    return (
        <table className='w-auto h-auto table-auto border-seperate'>
            <thead>
                {table.getHeaderGroups().map((headerGroup) => (
                    <tr key={headerGroup.id}>
                        {headerGroup.headers.map((header) => (
                            <TableHeaderCell key={header.id ?? header.column.id} header={header} table={table} />
                        ))}
                    </tr>
                ))}
            </thead>
            <tbody>
                {table.getRowModel().rows.map((row) => (
                    <TableRow key={row.id} row={row} table={table} />
                ))}
            </tbody>
            <tfoot>
                {table.getFooterGroups().map((footerGroup) => (
                    <tr key={footerGroup.id}>
                        {footerGroup.headers.map((header) => (
                            <th key={header.id}>{header.isPlaceholder ? null : flexRender(header.column.columnDef.footer, header.getContext())}</th>
                        ))}
                    </tr>
                ))}
            </tfoot>
        </table>
    );
}
