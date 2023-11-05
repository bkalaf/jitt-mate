import { faCheckSquare, faSquareDashed } from '@fortawesome/pro-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { CellContext } from '@tanstack/react-table';

export function CheckboxTableCell<T>(props: CellContext<T, any>) {
    const value = props.getValue<boolean>();
    return <FontAwesomeIcon className='object-fill w-5 h-5 bg-transparent border border-sky-500 text-slate-700 aria-checked:text-fuchsia-600' size='lg' aria-checked={value} icon={value === true ? faCheckSquare : faSquareDashed} />;
    // return <input className='inline-flex mx-auto text-blue-500 checked:text-red-500' defaultChecked={value} />;
}
