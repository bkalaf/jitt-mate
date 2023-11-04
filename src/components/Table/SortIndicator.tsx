import { SortDirection } from '@tanstack/react-table';
import { $cn } from '../../util/$cn';
import { faArrowDownAZ, faArrowUpZA } from '@fortawesome/pro-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { getNumericDuotoneIcons } from '../getNumericDuotoneIcons';


export function SortIndicator({ canSort, isSorted, sortIndex }: { canSort: boolean; isSorted: false | SortDirection; sortIndex: number; }) {
    const spread = $cn({}, { 'hidden': canSort === false || isSorted === false }, 'absolute left-0 top-0 bottom-0 items-center inline-flex justify-start');
    return (
        <span {...spread}>
            <span className='relative flex p-0.5 bg-black fa-layers h-7 w-7 fa-fw overflow-visible'>
                <FontAwesomeIcon icon={isSorted === 'asc' ? faArrowDownAZ : faArrowUpZA} className='text-yellow-500' />
                {sortIndex >= 0 && <FontAwesomeIcon icon={getNumericDuotoneIcons(sortIndex.toFixed(0))} className='absolute inset-0 transform -translate-y-2 icon-superscript' transform='shrink-1 right-6 up-6' style={{}} />}
            </span>
        </span>
    );
}
