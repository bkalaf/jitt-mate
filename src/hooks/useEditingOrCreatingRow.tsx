import { useCallback, useMemo } from 'react';
import { MRT_ColumnDef, MRT_Row, MRT_RowData, MRT_TableInstance } from 'material-react-table';
import { ignore } from '../common/functions/ignore';
import { useMutation } from '@tanstack/react-query';
import { useLocalRealm } from '../routes/loaders/useLocalRealm';
import { updateRecordProp } from './updateRecord';
import { useCollectionRoute } from './useCollectionRoute';
import { useInvalidator } from './useInvalidator';
import { useFormContext } from 'react-hook-form';
import { useDependencies } from './useDependencies';

export function useEditingOrCreatingRow<T extends MRT_RowData>(props: Parameters<Exclude<MRT_ColumnDef<any, any>['Edit'], undefined>>[0], initialDisable: boolean, ...dependencies: IDependency[]) {
    const spread = useDependencies(props, initialDisable, ...dependencies);
    const formContext = useFormContext();
    const { creatingRow } = props.table.getState();
    const isCreating = creatingRow?.id === props.row.id;
    const collection = useCollectionRoute();
    const onSuccess = useInvalidator(collection);
    const db = useLocalRealm();
    const { mutateAsync } = useMutation({
        mutationFn: updateRecordProp(collection, db),
        ...onSuccess
    });
    const onChange = useCallback((func?: () => void) => {
        return (data: any) => {
            if (isCreating) {
                props.table.setCreatingRow((current) => {
                    if (current == null || typeof current === 'boolean') return current;
                    const { _valuesCache, ...rest } = current;
                    const nextCache = { ..._valuesCache, [spread.name]: data };
                    const nextRow = { ...rest, _valuesCache: nextCache };
                    formContext.setValue(spread.name, data);
                    return nextRow;
                });
            } else {
                mutateAsync({
                    _id: props.row.original._id,
                    propertyName: spread.name,
                    value: data
                }).then(func ?? ignore);
            }
        };
    }, [formContext, isCreating, mutateAsync, props.row.original._id, props.table, spread.name]);
    return onChange;
}
