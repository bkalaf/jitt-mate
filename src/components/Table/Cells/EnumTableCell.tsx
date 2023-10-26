import { CellContext } from '@tanstack/react-table';
import { useColumnMeta } from '../../../hooks/useColumnMeta';
import { useCallback, useMemo } from 'react';
import { BSON } from 'realm';
import { useCollectionViewContext } from '../../useCollectionViewContext';
import { useGetRowId } from '../../../schema/useGetRowId';

export function EnumTableCell<T extends { _id: BSON.ObjectId }>(props: CellContext<T, any>) {
    const { isEdittable, mutate } = useCollectionViewContext<T>();
    const { enumMap } = useColumnMeta<T>(props.column);
    console.log(`meta`, props.column.columnDef.meta)
    const $isEdittable = useMemo(() => isEdittable(props.row), [isEdittable, props.row]);
    const value = useMemo(() => {
        return props.getValue<string | undefined>();
    }, [props]);
    const getRowId = useGetRowId();
    const $onChange = useCallback((ev: React.ChangeEvent<HTMLSelectElement>) => {
        // $setValue(ev.target.selectedOptions[0].value ?? '');
        mutate({ id: getRowId(props.row.original), propertyName: props.column.id, value: ev.target.selectedOptions[0].value });
    }, [getRowId, mutate, props.column.id, props.row.original]);
    return $isEdittable ? (
        <select className='flex w-full h-full p-1 text-base font-normal text-black border border-black font-raleway bg-zinc-400' value={value ?? ''} onChange={$onChange}>
            <option key='def' value='' label='Choose...' />
            {Object.entries(enumMap ?? {}).map(([k, v]) => (
                <option key={k} value={k} label={v ?? ''} />
            ))}
        </select>
    ) : value == null ? null : (
        (enumMap ?? {})[value as string]
    );
}
