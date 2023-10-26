import { Row, Table } from '@tanstack/react-table';
import { TableBodyCell } from './TableBodyCell';
import { useRenderSubComponent } from '../../dto/useRenderSubComponent';

export function TableRow<T extends EntityBase>({ row, table }: { table: Table<T>; row: Row<T> }) {
    const { SubComponent } = useRenderSubComponent();
    return (
        <>
            <tr key={row.id} className='even:row-even odd:row-odd'>
                {row.getVisibleCells().map((cell) => (
                    <TableBodyCell key={cell.id ?? cell.column.id} cell={cell} table={table} />
                ))}
            </tr>
            {row.getIsExpanded() && (
                <tr>
                    <td colSpan={row.getVisibleCells().length}>
                        <SubComponent />
                    </td>
                </tr>
            )}
        </>
    );
}
