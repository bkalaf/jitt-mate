/* eslint-disable @typescript-eslint/no-explicit-any */
import { MRT_Row, MRT_RowData, MaterialReactTable, useMaterialReactTable } from 'material-react-table';
import { IBarcode, IRealmEntity } from '../../dal/types';
import { Row } from '@tanstack/react-table';
import { useMUIItemReactTable } from '../../hooks/useMUIItemReactTable';

export function CollectionItemTableMRT<T extends MRT_RowData & EntityBase & IRealmEntity<T>>(props: {
    type?: 'object' | 'list' | 'dictionary' | 'set';
    propertyName?: string;
    objectType?: string;
    parentRow?: MRT_Row<AnyObject>;
}) {
    // const getRowId = useCallback((entity: T) => fromOID(entity._id), []);
    // const { data, isError, isInsertError, isInsertPending, isLoading, onCreatingRowCancel, onCreatingRowSave, onEditingRowCancel, onEditingRowSave } = useAsyncLoading<T>(collectionRoute);
    // const deleteOne = useDeleteOne(collectionRoute);
    // const { state, ...options } = useStandardTableOptions(data, isLoading, isError, deleteOne, { collection: collectionRoute });
    const { dataUpdatedAt, options } = useMUIItemReactTable<T>(props);
    const table = useMaterialReactTable({
        ...options,
        sortingFns: {
            sortBarcode: (rowA: Row<{ barcode: IBarcode; }>, rowB: Row<{ barcode: IBarcode; }>) => {
                const bcA = parseInt(rowA.original.barcode.rawValue, 10);
                const bcB = parseInt(rowB.original.barcode.rawValue, 10);
                return bcA < bcB ? -1 : bcA > bcB ? 1 : 0;
            }
        }
    } as any);
    console.log(`CollectionTableMRT.options`, table.options);
    return (
        <>
            <MaterialReactTable table={table} />
            <div className='flex items-center justify-end w-full'>
                <span className='inline-flex'>{new Date(dataUpdatedAt).toLocaleString()}</span>
            </div>
        </>
    );
}
