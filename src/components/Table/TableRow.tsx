import { Row, Table } from '@tanstack/react-table';
import { TableBodyCell } from './Cells/TableBodyCell';
import { useCollectionViewContext } from '../../hooks/useCollectionViewContext';
import { FormProvider } from '../Contexts/FormProvider';
import { EditTableBodyCell } from './Cells/DefaultEditBodyCell';
import { useCallback } from 'react';
import { fromOID } from '../../dal/fromOID';

// .filter(x => !['editRow', 'expandRow'].includes(x.id))
export function TableRow<T extends EntityBase>({ row, table, SubComponent, getId }: { table: Table<T>; row: Row<T>; SubComponent: SubComponentFunction<T>; getId: (x: T) => string }) {
    const context = useCollectionViewContext();
    if (context == null) throw new Error('no collection view');
    const { isRowEdittable, updateRecord, setRowEdittable } = context;
    const toggleSelected = row.getToggleSelectedHandler();
    const onSubmit = useCallback((data: T, dirty: string[]) => {
        updateRecord({ payload: data, dirtyProperties: dirty, id: fromOID(data._id) }, {
            onSuccess: () => setRowEdittable(undefined)
        })
    }, [setRowEdittable, updateRecord])
    return (
        <>
            <tr key={row.id} className='group even:row-even odd:row-odd aria-selected:bg-amber-500 aria-selected:text-black' onClick={toggleSelected} aria-selected={row.getIsSelected()}>
                {isRowEdittable(row) ? (
                    <FormProvider submit={onSubmit}>
                        {row.getVisibleCells().map((cell) => (
                            <EditTableBodyCell getId={getId} key={cell.id ?? cell.column.id} {...cell.getContext()} />
                        ))}
                    </FormProvider>
                ) : (
                    row.getVisibleCells().map((cell) => <TableBodyCell key={cell.id ?? cell.column.id} cell={cell} table={table} />)
                )}
            </tr>
            {row.getIsExpanded() && (
                <tr>
                    <td colSpan={row.getVisibleCells().length}>
                        <SubComponent table={table} row={row} collectionName={table.options.meta?.collectionName ?? ''} />
                    </td>
                </tr>
            )}
        </>
    );
}
