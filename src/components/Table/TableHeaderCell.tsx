import { Column, ColumnMeta, FilterFn, Header, Table, flexRender } from '@tanstack/react-table';
import { useCallback, useState } from 'react';
import { faArrowSquareLeft, faArrowSquareRight, faCancel, faSortDown, faSortUp } from '@fortawesome/pro-solid-svg-icons';
import { getNumericIconFromText } from '../../common/fa/getNumericIconFromText';
import { SortIndicator } from './SortIndicator';
import { useCollectionViewContext } from '../../hooks/useCollectionViewContext';
import React from 'react';
import { DebouncedInput } from './Controls/DebouncedInput';
import { konst } from '../../common/functions/konst';
import { FALSE } from '../../common/FALSE';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Button } from '../Buttons/Button';
import { both } from '../../common/functions/both';
import { not } from '../../common/not';

export function TableHeaderCell({ header, table }: { header: Header<any, unknown>; table: Table<any> }) {
    const size = header.getSize();
    const filteringEnabled = useCollectionViewContext()?.filteringEnabled ?? FALSE;

    console.log(`header ${header.column.id} size: ${size}`);
    const onClick = useCallback(() => {
        if (header.column.getCanSort()) {
            header.column.toggleSorting(undefined, true);
        }
    }, [header.column]);
    header.column.getCanPin;
    header.column.getIsPinned;
    header.column.pin;

    const pinLeft = useCallback(
        (ev: React.MouseEvent) => {
            ev.preventDefault();
            ev.stopPropagation();
            header.column.pin('left');
        },
        [header.column]
    );
    const pinRight = useCallback(
        (ev: React.MouseEvent) => {
            ev.preventDefault();
            ev.stopPropagation();
            header.column.pin('right');
        },
        [header.column]
    );
    const unpin = useCallback(
        (ev: React.MouseEvent) => {
            ev.preventDefault();
            ev.stopPropagation();
            header.column.pin(false);
        },
        [header.column]
    );

    return (
        <th className='relative text-lg font-extrabold text-center text-white whitespace-pre align-middle border border-white bg-sky-800' key={header.id} onClick={onClick}>
            <span className='flex flex-col w-full h-full'>
                <span className='inline-flex px-5'>
                    {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                    <SortIndicator canSort={header.column.getCanSort()} sortIndex={header.column.getSortIndex()} isSorted={header.column.getIsSorted()} />
                </span>
                <span className='flex w-full'>{filteringEnabled() && <ColumnFilter column={header.column} table={table} />}</span>
                <span className='flex justify-around w-full'>
                    <Button
                        icon={faArrowSquareLeft}
                        onClick={pinLeft}
                        renderCondition={both(header.column.getCanPin)(() => header.column.getIsPinned() !== 'left')}
                        className='flex p-0.5 w-5 h-5 bg-cyan-500 fa-fw'
                    />
                    <Button
                        className='flex p-0.5 w-5 h-5 bg-cyan-500 fa-fw'
                        icon={faCancel}
                        onClick={unpin}
                        renderCondition={both(header.column.getCanPin)(() => header.column.getIsPinned() !== false)}
                    />
                    <Button
                        className='flex p-0.5 w-5 h-5 bg-cyan-500 fa-fw'
                        icon={faArrowSquareRight}
                        onClick={pinRight}
                        renderCondition={both(header.column.getCanPin)(() => header.column.getIsPinned() !== 'right')}
                    />
                </span>
            </span>
        </th>
    );
}

export function ColumnFilter<TValue>(props: { column: Column<any, any>; table: Table<any> }) {
    return props.column.getCanFilter() ? <Filter column={props.column} table={props.table} /> : <></>;
}

function Filter({ column, table }: { column: Column<any, unknown>; table: Table<any> }) {
    const firstValue = table.getPreFilteredRowModel().flatRows[0]?.getValue(column.id);

    const columnFilterValue = column.getFilterValue();

    const sortedUniqueValues = React.useMemo(() => (typeof firstValue === 'number' ? [] : Array.from(column.getFacetedUniqueValues().keys()).sort()), [column, firstValue]);

    return typeof firstValue === 'number' ? (
        <div>
            <div className='flex space-x-2'>
                <DebouncedInput
                    type='number'
                    min={Number(column.getFacetedMinMaxValues()?.[0] ?? '')}
                    max={Number(column.getFacetedMinMaxValues()?.[1] ?? '')}
                    value={(columnFilterValue as [number, number])?.[0] ?? ''}
                    onChange={(value) => column.setFilterValue((old: [number, number]) => [value, old?.[1]])}
                    placeholder={`Min ${column.getFacetedMinMaxValues()?.[0] ? `(${column.getFacetedMinMaxValues()?.[0]})` : ''}`}
                    className='w-24 border rounded shadow'
                />
                <DebouncedInput
                    type='number'
                    min={Number(column.getFacetedMinMaxValues()?.[0] ?? '')}
                    max={Number(column.getFacetedMinMaxValues()?.[1] ?? '')}
                    value={(columnFilterValue as [number, number])?.[1] ?? ''}
                    onChange={(value) => column.setFilterValue((old: [number, number]) => [old?.[0], value])}
                    placeholder={`Max ${column.getFacetedMinMaxValues()?.[1] ? `(${column.getFacetedMinMaxValues()?.[1]})` : ''}`}
                    className='w-24 border rounded shadow'
                />
            </div>
            <div className='h-1' />
        </div>
    ) : (
        <>
            <datalist id={column.id + 'list'}>
                {sortedUniqueValues.slice(0, 5000).map((value: any) => (
                    <option value={value} key={value} />
                ))}
            </datalist>
            <DebouncedInput
                type='text'
                value={(columnFilterValue ?? '') as string}
                onChange={(value) => column.setFilterValue(value)}
                placeholder={`Search... (${column.getFacetedUniqueValues().size})`}
                className='border rounded shadow w-36'
                list={column.id + 'list'}
            />
            <div className='h-1' />
        </>
    );
}
