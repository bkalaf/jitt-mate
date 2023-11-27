import { MultiSelectElement } from 'react-hook-form-mui';
import { useQuery } from '@tanstack/react-query';
import { useLocalRealm } from '../../routes/loaders/useLocalRealm';
import { fromOID } from '../../dal/fromOID';

export function MRTDbSetControl<T extends AnyObject>(objectType: string, name: string, label: string, itemValue: string, _itemKey = '_ID') {
    return function MRT_DbSetControl() {
        const db = useLocalRealm();
        const [itemKey, func]: [string, (x: T) => T] = _itemKey === '_ID' ? ['_id', (x: T) => ({ ...x, _id: fromOID(x._id) } as T)] : [_itemKey, (x) => x];
        const { data } = useQuery({
            queryKey: [objectType],
            queryFn: () => {
                return Promise.resolve((db.objects<T>(objectType) ?? []).map(func) as T[]);
            },
            initialData: [] as T[]
        });
        return (
            <MultiSelectElement
                label={label}
                name={name}
                options={data ?? []}
                itemKey={itemKey}
                itemValue={itemValue}
                renderValue={(selected?: unknown) => `${((selected as unknown[]) ?? [])?.length ?? 0} item(s) selected.`}
                className='hidden'
                inputProps={{ type: 'hidden' }}
            />
        );
    };
}
