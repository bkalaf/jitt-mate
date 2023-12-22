import { UseFormReturn } from 'react-hook-form-mui';
import { MRT_Row, MRT_RowData } from 'material-react-table';
import { is } from '../../../common/is';
import { checkTransaction } from '../../../util/checkTransaction';
import { toNotNullOID } from '../../../dal/toOID';

// creatingRow: MRT_Row<T> | null, setCreatingRow: MRT_TableInstance<T>['setCreatingRow']

export function updateDictionary<T extends MRT_RowData, TValue>(db: Realm, collection: RealmObjects, propertyName: string, formContext: UseFormReturn, creatingRow: MRT_Row<T> | null) {
    return function ({ _id, key, value }: { _id: OID; key: string; value: TValue | undefined; }) {
        if (creatingRow) {
            if (typeof creatingRow === 'boolean') return Promise.reject(new Error('creating row is a boolean'));
            const dictionary = formContext.watch(propertyName);
            formContext.setValue(propertyName, { ...(dictionary ?? {}), [key]: value });
            // const { _valuesCache } = creatingRow;
            // const dictionary = (_valuesCache[propertyName] as Record<string, TValue> | undefined) ??  {};
            // setCreatingRow({ ...creatingRow, _valuesCache: { ..._valuesCache, [propertyName]: { ...dictionary, [key]: value }}});
            return Promise.resolve();
        }
        const obj = db.objectForPrimaryKey<T>(collection, toNotNullOID(_id) as T[keyof T]);
        if (obj == null) {
            return Promise.reject(new Error(`cannot find obj ${_id.toString()}`));
        }
        const dictionary = (obj[propertyName] as DBDictionary<TValue> | Record<string, TValue> | undefined) ?? {};
        if (is.dbDictionary(dictionary)) {
            checkTransaction(db)(() => (value == null ? dictionary.remove(key) : (dictionary[key] = value)));
            return Promise.resolve();
        }
        checkTransaction(db)(() => (value == null ? delete (dictionary ?? {})[key] : { ...(dictionary ?? {}), [key]: value }));
        return Promise.resolve();
    };
}
