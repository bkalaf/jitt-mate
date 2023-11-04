import { Table, flexRender } from '@tanstack/react-table';
import { TableHeaderCell } from './TableHeaderCell';
import { TableRow } from './TableRow';
import { useEffect } from 'react';
import { DebouncedInput } from './DebouncedInput';


export function ReactTable<T>({ getId, table, SubComponent, setChildren }: { table: Table<T>; SubComponent: SubComponentFunction<T>; getId: (x: T) => string, setChildren: StateSetter<JSX.Element | null> }) {
    const inputID = `global-filter-input`;
    const labelID = `${inputID}-label`;
    useEffect(() => {
        setChildren(
            <div className='flex flex-row'>
                <label id={labelID} htmlFor={inputID} className='flex items-center justify-start w-full text-lg font-bold indent-2 font-fira-sans'>
                    Filter:{' '}
                </label>
                <DebouncedInput
                    id={inputID}
                    aria-labelledby={labelID}
                    type='text'
                    name='global-filter'
                    className='flex w-full h-full p-1 text-base font-normal font-raleway'
                    value={table.getState().globalFilter}
                    onChange={table.setGlobalFilter}
                />
            </div>
        );
    }, [inputID, labelID, setChildren, table])
    return table && <>
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
                            <TableRow key={row.id} SubComponent={SubComponent} row={row as any} table={table as any} getId={getId as any} />
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
            </>
        
}
