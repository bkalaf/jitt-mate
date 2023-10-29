import { CellContext } from '@tanstack/react-table';

export function StringTableCell<T>(props: CellContext<T, any>) {
    return  props.getValue<string | undefined>();
    // return $isEdittable ? <input className='flex w-full h-full p-1 text-lg font-medium font-open-sans' value={$value} onChange={$onChange} onBlur={$onBlur} /> : <span className='flex w-full text-base font-normal indent-3 font-open-sans'>{value ?? null}</span>;
}
