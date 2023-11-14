import { CellContext } from '@tanstack/react-table';
import { identity } from '../../../common/functions/identity';

export function StringTableCell<T>(props: CellContext<T, any>): string | null {
    const formatter = identity;
    return formatter(props.getValue<string | undefined>()) ?? null;
    // return $isEdittable ? <input className='flex w-full h-full p-1 text-lg font-medium font-open-sans' value={$value} onChange={$onChange} onBlur={$onBlur} /> : <span className='flex w-full text-base font-normal indent-3 font-open-sans'>{value ?? null}</span>;
}
