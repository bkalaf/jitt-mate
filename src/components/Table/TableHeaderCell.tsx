import { Header, SortDirection, Table, flexRender } from '@tanstack/react-table';
import { useCallback } from 'react';
import { $cn } from '../../util/$cn';
import { faArrowDownAZ, faArrowUpZA, faSortDown, faSortUp } from '@fortawesome/pro-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { getNumericIconFromText } from '../getNumericIconFromText';
import { getNumericDuotoneIcons } from '../getNumericDuotoneIcons';

export function TableHeaderCell({ header }: { header: Header<any, unknown>; table: Table<any> }) {
    const size = header.getSize()
    console.log(`header ${header.column.id} size: ${size}`);
    const onClick = useCallback(() => {
        if (header.column.getCanSort()) {
            header.column.toggleSorting(undefined, true);
        }
    }, [header.column]);
    
    return (
        <th className='relative text-lg font-extrabold text-center text-white whitespace-pre align-middle border border-white bg-sky-800' key={header.id} onClick={onClick}>
            <span className='inline-flex px-5'>
                {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                <SortIndicator canSort={header.column.getCanSort()} sortIndex={header.column.getSortIndex()} isSorted={header.column.getIsSorted()} />
            </span>
        </th>
    );
}

export function SortIndicator({ canSort, isSorted, sortIndex }: { canSort: boolean; isSorted: false | SortDirection; sortIndex: number }) {
    const spread = $cn({}, { 'hidden': canSort === false || isSorted === false }, 'absolute left-0 top-0 bottom-0 items-center inline-flex justify-start');
    return (
        <span {...spread}>
            <span className='relative flex p-0.5 bg-black fa-layers h-7 w-7 fa-fw overflow-visible'>
                <FontAwesomeIcon icon={isSorted === 'asc' ? faArrowDownAZ : faArrowUpZA} className='text-yellow-500' />
                {sortIndex >= 0 && <FontAwesomeIcon icon={getNumericDuotoneIcons(sortIndex.toFixed(0))} className='absolute inset-0 transform -translate-y-2 icon-superscript' transform='shrink-1 right-6 up-6'  style={{
                    
                }}/>} 
            </span>
        </span>
    );
}