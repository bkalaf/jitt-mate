import { faCheckSquare, faSquareDashed } from '@fortawesome/pro-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { CellContext } from '@tanstack/react-table';

export function CheckboxTableCell<T>(props: CellContext<T, any>) {
    const value = props.getValue<boolean>();
    return <FontAwesomeIcon className='w-4 h-4 bg-transparent border border-sky-500 text-slate-700' icon={value === true ? faCheckSquare : faSquareDashed} />;
    // return <input className='inline-flex mx-auto text-blue-500 checked:text-red-500' defaultChecked={value} />;
}
