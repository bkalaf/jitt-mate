import { CellContext } from '@tanstack/react-table';
import { useCallback, useMemo, useState } from 'react';
import { useRealmContext } from '../../../hooks/useRealmContext';
import { BSON } from 'realm';
import { useCollectionViewContext } from '../../useCollectionViewContext';
import { useGetRowId } from '../../../schema/useGetRowId';
import { checkTransaction } from '../../../util/checkTransaction';

export function StringTableCell<T extends { _id: BSON.ObjectId }>(props: CellContext<T, any>) {
    const value = props.getValue<string | undefined>();
    const { isEdittable, mutate } = useCollectionViewContext<T>();
    const $isEdittable = useMemo(() => isEdittable(props.row), [isEdittable, props.row]);
    const [$value, $setValue] = useState(value ?? '');
    const $onChange = useCallback((ev: React.ChangeEvent<HTMLInputElement>) => {
        $setValue(ev.target.value ?? '');
    }, []);
    const { db } = useRealmContext();
    const getRowId = useGetRowId();
    const $onBlur = useCallback(() => {
        if (db == null) throw new Error('no db');
        if (value != $value) {
            const func = () => {
                mutate({ id: getRowId(props.row.original), propertyName: props.column.id, value: $value })
            };
            checkTransaction(db)(func);
        }
    }, [$value, db, getRowId, mutate, props.column.id, props.row.original, value]);
    return $isEdittable ? (
        <input className='flex w-full h-full p-1 text-base font-normal font-raleway' value={$value} onChange={$onChange} onBlur={$onBlur} />
    ) : (
        value ?? null
    );
    // return $isEdittable ? <input className='flex w-full h-full p-1 text-lg font-medium font-open-sans' value={$value} onChange={$onChange} onBlur={$onBlur} /> : <span className='flex w-full text-base font-normal indent-3 font-open-sans'>{value ?? null}</span>;
}


