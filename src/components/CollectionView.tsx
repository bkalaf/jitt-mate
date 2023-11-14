import { is } from '../dal/is';

export type PaginationButtonProps = [() => boolean, () => void];

export function addIndex<T>(arr: T[]) {
    return arr.map((x, ix) => [ix, x] as [number, T]);
}
export function collectionToArray<TValue>(coll: DBList<TValue> | DBDictionary<TValue> | DBSet<TValue>) {
    if (is.dbDictionary(coll)) return Object.entries(coll);
    if (is.dbList(coll)) return addIndex<TValue>(Array.from(coll.values())).map(([k, v]) => [k.toFixed(0), v] as [string, TValue]);
    if (is.dbSet(coll)) return addIndex<TValue>(Array.from(coll.values())).map(([k, v]) => [k.toFixed(0), v] as [string, TValue]);
    return [];
}

