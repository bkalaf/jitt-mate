import { useCallback, useMemo, useState } from 'react';
import { BSON } from 'realm';
import { useGetRowId } from '../schema/useGetRowId';
import { Row } from '@tanstack/react-table';
import { ICollectionViewContext } from '../components/Contexts/CollectionViewContext';
import { useUpdateRecord } from './useUpdateRecord';
import { useInsertRecord } from './useInsertRecord';
import { useCollectionViewContext } from './useCollectionViewContext';
import { useLog } from '../components/Contexts/useLogger';
import { fromOID } from '../dal/fromOID';
import { useOptionalCollectionRoute } from './useOptionalCollectionRoute';
import { useToggler } from './useToggler';

export function useProvideCollectionViewContext<T extends EntityBase>(param: any): ICollectionViewContext<T> {
    const collectionName = useOptionalCollectionRoute();
    const log = useLog('view');
    log('NEW PARAM', `\t[${param}]`);
    const context = useCollectionViewContext();
    const depth = (context?.depth ?? -1) + 1;
    const params = useMemo(() => [...(context?.params ?? []), param], [context?.params, param]);
    log('DEPTH', '\t'.concat(depth.toFixed(0)));
    log('PARAMS', '\t'.concat(JSON.stringify(params, null, '\t')));
    const getRowId = useGetRowId<T>();
    const [edittingRow, _setEdittingRow] = useState<OID | undefined>();
    const setRowEdittable = useCallback(
        (row?: Row<T>) => {
            _setEdittingRow((prev) => {
                const current = row != null ? getRowId(row.original) : undefined;
                if (current === prev) {
                    return undefined;
                }
                return current;
            });
        },
        [getRowId]
    );
    const isRowEdittable = useCallback(
        (row: Row<T>) => {
            return getRowId(row.original) === fromOID(edittingRow);
        },
        [edittingRow, getRowId]
    );
    const updateRecord = useUpdateRecord<T>(collectionName);
    const [isFilteringEnabled, toggleFiltering] = useToggler(false);
    const filteringEnabled = useCallback(() => {
        return isFilteringEnabled;
    }, [isFilteringEnabled]);
    // const { mutate: updateOne } = useMutation({
    //     mutationFn: ({ id, propertyName, value }: { id: OID; propertyName: string; value?: any }) => {
    //         const func = () => {
    //             const original = db.objectForPrimaryKey(collectionName ?? '', toOID(id));
    //             if (original == null) throw new Error('could not find realm.object');
    //             original[propertyName] = value;
    //         };
    //         checkTransaction(db)(func);
    //         return Promise.resolve();
    //     },
    //     ...invalidator
    // });
    return {
        depth,
        params,
        isRowEdittable,
        setRowEdittable,
        updateRecord,
        filteringEnabled,
        toggleFiltering
    };
}
