import { Row, Table, flexRender } from '@tanstack/react-table';
import { TableHeaderCell } from './TableHeaderCell';
import { TableRow } from './TableRow';
import { useTableControlsContext } from '../Contexts/useTableControlsContext';

export function useTable<T extends EntityBase>(source: string) {
    const { getTable } = useTableControlsContext<T>();
    // const table = useMemo(() => {
    //     console.log(`table memoized from: ${source}`);
    //     const value = getTable();
    //     console.log(`value`);
    //     console.log(value);
    //     return value;
    // }, [getTable, source])
    console.log(`retrieved table from: ${source}`)
    return getTable();
}
export function ReactTable<T>({ getId, table, SubComponent }: { table: Table<T>; SubComponent: SubComponentFunction<T>; getId: (x: T) => string }) {
    return (table &&
        <table className='relative w-full h-full p-0 overflow-auto table-auto border-seperate'>
            <thead className='sticky top-0 m-0'>
                {table.getHeaderGroups().map((headerGroup) => (
                    <tr key={headerGroup.id}>
                        {headerGroup.headers.map((header) => (
                            <TableHeaderCell key={header.id ?? header.column.id} header={header} table={table} />
                        ))}
                    </tr>
                ))}
            </thead>
            <tbody className='w-auto h-full'>
                {table.getRowModel().rows.map((row) => (
                    <TableRow key={row.id} SubComponent={SubComponent} row={row} table={table as any} getId={getId} />
                ))}
            </tbody>
            <tfoot className='sticky bottom-0'>
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
