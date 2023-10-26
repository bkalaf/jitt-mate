import { CellContext } from '@tanstack/react-table';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faKey } from '@fortawesome/pro-solid-svg-icons';

export function OIDTableCell<T>(props: CellContext<T, any>) {
    const value = props.getValue<string>();
    return (
        <span className='flex w-full h-full p-1 rounded-md bg-slate-700' title={['ID: ', value].join('')}>
            <FontAwesomeIcon icon={faKey} className='inline-block text-yellow-400' size='lg' />
        </span>
    );
}
