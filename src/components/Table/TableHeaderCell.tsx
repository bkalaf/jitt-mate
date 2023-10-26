import { Header, Table, flexRender } from '@tanstack/react-table';

export function TableHeaderCell({ header }: { header: Header<any, unknown>; table: Table<any> }) {
    const size = header.getSize()
    console.log(`header ${header.column.id} size: ${size}`)
    return (
        <th className='text-lg font-extrabold text-center text-white align-middle border border-white bg-sky-800' key={header.id}>
            {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
        </th>
    );
}
