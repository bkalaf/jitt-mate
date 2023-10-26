import { useCallback, useState } from 'react';
import { BSON } from 'realm';
import { useGetRowId } from '../schema/useGetRowId';
import { Row } from '@tanstack/react-table';
import { ICollectionViewContext } from './CollectionViewContext';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useRealmContext } from '../hooks/useRealmContext';
import { useCollectionRoute } from '../hooks/useCollectionRoute';
import { toOID } from '../dto/toOID';
import { checkTransaction } from '../util/checkTransaction';

export function useProvideCollectionViewContext<T extends { _id: BSON.ObjectId }>(): ICollectionViewContext<T> {
    const getRowId = useGetRowId<T>();
    const { db } = useRealmContext();
    const [edittingRow, _setEdittingRow] = useState<string | undefined>();
    const isInEditMode = useCallback(() => edittingRow != null, [edittingRow]);
    const setEdittingRow = useCallback(
        (row: Row<T> | undefined) => {
            _setEdittingRow(row != null ? getRowId(row.original) : undefined);
        },
        [getRowId]
    );
    const isEdittable = useCallback((row: Row<T>) => getRowId(row.original) === edittingRow, [edittingRow, getRowId]);
    if (db == null) throw new Error('no db');
    const collectionName = useCollectionRoute();
    const queryClient = useQueryClient();
    const { mutate } = useMutation({
        mutationFn: ({ id, propertyName, value }: { id: string; propertyName: string; value?: any }) => {
            const func = () => {
                const original = db.objectForPrimaryKey(collectionName ?? '', toOID(id));
                if (original == null) throw new Error('could not find realm.object');
                original[propertyName] = value;
            };
            checkTransaction(db)(func);
            return Promise.resolve();
        },
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: [collectionName ?? '']
            });
            queryClient.refetchQueries({
                queryKey: [collectionName ?? '']
            });
        }
    });
    return {
        edittingRow,
        isInEditMode,
        setEdittingRow,
        isEdittable,
        mutate
    };
}
