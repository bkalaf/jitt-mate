import { CellContext } from '@tanstack/react-table';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faKey } from '@fortawesome/pro-solid-svg-icons';

export function OIDTableCell<T>(props: CellContext<T, any>) {
    const value = props.getValue<string>();
    return (
        <span className='w-4 h-4 bg-transparent border border-sky-500 text-slate-700' title={['ID: ', value].join('')}>
            <FontAwesomeIcon icon={faKey} className='block object-fill' />
        </span>
    );
}
