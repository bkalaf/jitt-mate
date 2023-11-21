import { IRealmEntity } from '../dal/types';
import { useCallback } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useLocalRealm } from '../routes/loaders/useLocalRealm';
import { useInsertRecord } from './useInsertRecord';
import { useUpdateRecord } from './useUpdateRecord';
import { flattenPayload } from '../util/flattenPayload';

/** @deprecated */
export function useAsyncLoading<T extends AnyObject & IRealmEntity<T>>(collection: string) {
    const db = useLocalRealm();
    const { data, isLoading, isError } = useQuery({
        queryKey: [collection],
        queryFn: () => {
            const result = db.objects<T>(collection);
            return Promise.resolve(Array.from(result));
        }
    });
    const [executeInsert, isInsertError, isInsertPending, insertStatus] = useInsertRecord<T>(collection);

    const executeUpdate = useUpdateRecord(collection);
    const onCreatingRowSave = useCallback(
        (props: MRT_TableOptionFunctionParams<T, 'onCreatingRowSave'>) => {
            const payload = flattenPayload<T>(props.values as T);
            executeInsert(payload, {
                onSuccess: () => {
                    props.exitCreatingMode();
                    // props.table.setCreatingRow(null);
                }
            });
        },
        [executeInsert]
    );
    const onEditingRowSave = useCallback(
        (props: MRT_TableOptionFunctionParams<T, 'onEditingRowSave'>) => {
            const payload = flattenPayload<T>(props.values as T);
            executeUpdate({ payload, id: payload._id });
            props.exitEditingMode();
        },
        [executeUpdate]
    );
    const onEditingRowCancel = useCallback((props: MRT_TableOptionFunctionParams<T, 'onEditingRowCancel'>) => {
        props.table.setEditingRow(null);
    }, []);
    const onCreatingRowCancel = useCallback((props: MRT_TableOptionFunctionParams<T, 'onCreatingRowCancel'>) => {
        props.table.setCreatingRow(null);
    }, []);
    return {
        data: (data ?? []) as T[],
        isLoadingOrPending: isLoading || isInsertPending,
        isEitherErrored: isError || isInsertError,
        isLoading,
        isError,
        isInsertError,
        isInsertPending,
        onEditingRowSave,
        onCreatingRowCancel,
        onEditingRowCancel,
        onCreatingRowSave
    };
}
