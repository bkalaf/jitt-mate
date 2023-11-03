import { Table, flexRender } from '@tanstack/react-table';
import { TableHeaderCell } from './TableHeaderCell';
import { TableRow } from './TableRow';
import { useCallback, useEffect, useRef, useState } from 'react';


export function ReactTable<T>({ getId, table, SubComponent, setChildren }: { table: Table<T>; SubComponent: SubComponentFunction<T>; getId: (x: T) => string, setChildren: StateSetter<JSX.Element | null> }) {
    const [localGlobalValue, setLocalGlobalValue] = useState<null | string>(null);
    const token = useRef<NodeJS.Timeout | undefined>();
    const setGlobalValue = useCallback((v?: string) => {
        table.setGlobalFilter(v);
        token.current = undefined;
    }, [table])
    const setValue = useCallback((ev: React.ChangeEvent<HTMLInputElement>) => {
        setLocalGlobalValue(ev.target.value.length === 0 ? null : ev.target.value)
        if (token.current) {
            clearTimeout(token.current);
        }
        token.current = setTimeout(() => setGlobalValue(ev.target.value.length === 0 ? undefined : ev.target.value), 250);
    }, [setGlobalValue])
    const inputID = `global-filter-input`;
    const labelID = `${inputID}-label`;
    useEffect(() => {
        setChildren(
            <div className='flex flex-row'>
                <label id={labelID} htmlFor={inputID} className='flex items-center justify-start w-full text-lg font-bold indent-2 font-fira-sans'>
                    Filter:{' '}
                </label>
                <input
                    id={inputID}
                    aria-labelledby={labelID}
                    type='text'
                    name='global-filter'
                    className='flex w-full h-full p-1 text-base font-normal font-raleway'
                    value={localGlobalValue ?? ''}
                    onChange={setValue}
                />
            </div>
        );
    }, [inputID, labelID, localGlobalValue, setChildren, setValue])
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
