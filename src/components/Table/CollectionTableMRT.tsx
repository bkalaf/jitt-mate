/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { MRT_Row, MRT_RowData, MRT_TableOptions, MaterialReactTable, useMaterialReactTable } from 'material-react-table';
import { IRealmEntity } from '../../dal/types';
import { useMUIReactTable } from '../../hooks/useMUIReactTable';

export function CollectionTableMRT<T extends MRT_RowData & EntityBase & IRealmEntity<T>>(props: {
    type?: 'object' | 'list' | 'dictionary' | 'set';
    propertyName?: string;
    objectType?: string;
    parentRow?: MRT_Row<AnyObject>;
}) {
    // const getRowId = useCallback((entity: T) => fromOID(entity._id), []);
    // const { data, isError, isInsertError, isInsertPending, isLoading, onCreatingRowCancel, onCreatingRowSave, onEditingRowCancel, onEditingRowSave } = useAsyncLoading<T>(collectionRoute);
    // const deleteOne = useDeleteOne(collectionRoute);
    // const { state, ...options } = useStandardTableOptions(data, isLoading, isError, deleteOne, { collection: collectionRoute });
    const { dataUpdatedAt, options } = useMUIReactTable<T>(props);
    const table = useMaterialReactTable(options as MRT_TableOptions<T>);

    return (
        <>
            <section className='flex flex-col'>
                <MaterialReactTable table={table} />
                <div className='flex items-center justify-end w-full'>
                    <span className='inline-flex'>{new Date(dataUpdatedAt).toLocaleString()}</span>
                </div>
            </section>
        </>
    );
}

