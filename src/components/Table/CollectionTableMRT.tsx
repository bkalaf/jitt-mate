/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { MRT_Row, MRT_RowData, MaterialReactTable, useMaterialReactTable } from 'material-react-table';
import { IBarcode, IRealmEntity, ISku } from '../../dal/types';
import { useMUIReactTable } from '../../hooks/useMUIReactTable';
import { Row } from '@tanstack/react-table';
import { Outlet, useParams } from 'react-router';
import { useEffect } from 'react';
import { JITTCollectionContextProvider } from '../Contexts/JITTCollectionContext';

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
    const table = useMaterialReactTable({
        ...options,
        sortingFns: {
            sortBarcode: (rowA: Row<{ barcode: IBarcode }>, rowB: Row<{ barcode: IBarcode }>) => {
                const bcA = parseInt(rowA.original.barcode.rawValue, 10);
                const bcB = parseInt(rowB.original.barcode.rawValue, 10);
                return bcA < bcB ? -1 : bcA > bcB ? 1 : 0;
            }
        }
    } as any);
    console.log(`CollectionTableMRT.options`, table.options);
    const params = useParams();
    useEffect(() => {
        if (params.collection === 'sku') {
            (options.data as ISku[]).map((item) => {
                console.log(`title`, item.product?.apparelDetails.generateTitle(true));
                console.log(`narrative`, item.product?.apparelDetails.generateNarrative());
            });
        }
    }, [options.data, params.collection]);
    return Object.getOwnPropertyNames(params).includes('oid') ? <Outlet /> : <MaterialReactTable table={table} />;
}
