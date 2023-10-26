import { CellContext } from '@tanstack/react-table';
import { useColumnMeta } from '../../../hooks/useColumnMeta';
import { useCallback, useMemo, useState } from 'react';
import { BSON } from 'realm';
import { useQuery } from '@tanstack/react-query';
import { useObjectType } from '../../../routes/loaders/useObjectType';
import { useLocalRealm } from '../../../routes/loaders/useLocalRealm';
import { useFindAll } from '../../../routes/loaders/useFindAll';
import { useCollectionViewContext } from '../../useCollectionViewContext';
import { ofOID } from '../../../routes/loaders/ofOID';
import { useCreateDropdownOption } from '../../../hoooks/useCreateDropdownOption';

export function LookupTableCell<T extends EntityBase, TValue extends EntityBase>({ getValue, ...props}: CellContext<T, any>) {
    const { isEdittable, mutate } = useCollectionViewContext();
    const { labelProperty } = useColumnMeta<T>(props.column)
    const objectType = useObjectType(props.column);
    const toOption = useCreateDropdownOption<TValue>(objectType);
    const db = useLocalRealm();
    const dbValue = useMemo((): RealmObj<TValue> | undefined => getValue<RealmObj<TValue> | null>() ?? undefined, [getValue]);
    const textValue = useMemo(() => dbValue == null ? undefined : labelProperty == null ? undefined : dbValue[labelProperty as keyof TValue], [dbValue, labelProperty])
    const controlValue = useMemo(() => dbValue?._id.toHexString(), [dbValue?._id]);
    const updateDbValue = useCallback((oid?: string) => {
        if ((dbValue == null && oid == null) || dbValue?._id.toHexString() === oid) {
            return;
        }
        const obj = db?.objectForPrimaryKey<TValue>(objectType, new BSON.ObjectId(oid) as TValue['_id']) ?? undefined;
        mutate({ id: ofOID(props.row.original._id) ?? '', propertyName: props.column.id, value: obj });
    }, [db, dbValue, mutate, objectType, props.column.id, props.row.original._id]);
    const onChange = useCallback((ev: React.ChangeEvent<HTMLSelectElement>) => {
        const selected = Array.from(ev.target.selectedOptions).map(x => x.value);
        if (selected.length === 0) {
            updateDbValue(undefined)
        } else if (selected.length === 1) {
            updateDbValue(selected[0])
        } else {
            throw new Error('cannot handle multi select yet')
        }
    }, [updateDbValue])
    const queryModify = useFindAll<RealmObj<TValue>>(objectType);    
    const { data } = useQuery({
        queryKey: [objectType, 'dropdown'],
        queryFn: () => {
            const objs = db.objects<TValue>(objectType ?? '');
            const result = queryModify(objs).map(toOption).filter(x => x != null) as DropDownOptionInfo<TValue>[];
            return Promise.resolve(result);
        }
    });

    return isEdittable(props.row) ? (
        <select className='flex w-full h-full p-1 text-base font-normal text-black border border-black font-raleway bg-zinc-400' value={controlValue} onChange={onChange}>
            <option key='def' value='' label='Choose...' />
            {Array.from(data ?? []).map(({ value, label, key }) => {
                return <option key={key} value={value} label={label} />;
            })}
        </select>
    ) : (
        textValue?.toString() ?? null
    );
}
