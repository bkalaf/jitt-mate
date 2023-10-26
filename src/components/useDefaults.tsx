import { ColumnDef } from '@tanstack/table-core';
import { useCollectionRoute } from '../hooks/useCollectionRoute';
import { useCallback, useMemo } from 'react';
import $$schema from '../dto';
import Realm, { SortDescriptor } from 'realm';

export function useDefaults<T extends EntityBase>(): (result: Realm.Results<RealmObj<T>>) => Realm.Results<RealmObj<T>> {
    const collectionName = useCollectionRoute();
    const result = useMemo(
        () =>
            ($$schema as any as { schema: Realm.ObjectSchema; columns: ColumnDef<T, any>[]; defaultSort?: SortDescriptor[]; defaultFilters?: [string, any[]][] }[]).find(
                (x) => x.schema.name === collectionName
            ),
        [collectionName]
    );
    if (result == null) throw new Error('no ctor');
    const { defaultFilters, defaultSort } = result;
    return useCallback(
        (result: Realm.Results<RealmObj<T>>) => {
            const toSort = (r: Realm.Results<RealmObj<T>>) => (defaultSort == null ? r : r.sorted(defaultSort));
            const text = (defaultFilters ?? []).map((x) => x[0]).join(' && ');
            const args = (defaultFilters ?? []).map((x) => x[1]).reduce((pv, cv) => [...pv, ...cv], []);
            const toFilter = (r: Realm.Results<RealmObj<T>>) => (defaultFilters == null ? r : r.filtered(text, ...args));
            return toSort(toFilter(result));
        },
        [defaultFilters, defaultSort]
    );
}
