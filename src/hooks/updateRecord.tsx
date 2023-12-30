/* eslint-disable @typescript-eslint/no-explicit-any */
import { checkTransaction } from '../util/checkTransaction';
import * as Realm from 'realm';
import { MRT_Row, MRT_RowData } from 'material-react-table';
import { useFormContext } from 'react-hook-form-mui';
import { getProperty } from '../components/Contexts/getProperty';
import { ignore } from '../common/functions/ignore';
import { $convertToRealm } from '../components/Table/creators/$convertToRealm';
import { $$queryClient } from '../components/$$queryClient';

export function updateRecordProperty<T extends MRT_RowData>(db: Realm, collection: string,  context: ReturnType<typeof useFormContext>) {
    return async function ({ propertyNames, row }: { propertyNames: string[]; row: MRT_Row<T> }) {
        const _id = row.original._id as Realm.BSON.ObjectId;
        const { getValues, getFieldState } = context;
        const values = getValues();
        console.log(`values`, values);
        const convertTo = $convertToRealm[collection as keyof typeof $convertToRealm];
        const convertedValues = convertTo(values as any);
        console.log('convertedValues', convertedValues);
        const func = function (propName: string) {
            return () => {
                const { isDirty } = getFieldState(propName);
                const next = getProperty(propName)(convertedValues);
                const obj = db.objectForPrimaryKey<T>(collection, _id as T[keyof T]);
                if (obj == null) throw new Error(`could not retrieve Realm.Object: ${_id.toHexString()}`);
                if (isDirty) {
                    obj[propName as keyof typeof obj] = next as any;
                }
            };
        };
        const f = [...propertyNames.map(func), () => {
            if (row?.original.update && typeof row?.original.update === 'function') {
                row.original.update();
            }
        }].reduce(
            (f: () => void, g: () => void) => () => {
                f();
                g();
            },
            ignore
        );
        checkTransaction(db)(f);
    };
}
export function updateRecordProp(collection: string, db: Realm) {
    return async function({ propertyName, value, _id }: { propertyName: string, value: any; _id: OID }) {
        const func = () => {
            const obj = db.objectForPrimaryKey(collection, _id);
            if (obj == null) throw new Error('no obj');
            obj[propertyName] = value;
        }
        try {
            checkTransaction(db)(func);
            await $$queryClient.invalidateQueries({ queryKey: [collection] });
            await $$queryClient.refetchQueries({ queryKey: [collection] });
        } catch (error) {
            console.error(error);
            throw error;
        }
    }
}
export function updateRecord(collection: string, db: Realm) {
    return async function (values: any) {
        const func = () => {
            db.create(collection, values, Realm.UpdateMode.Modified);
        };
        try {
            checkTransaction(db)(func);
            await $$queryClient.invalidateQueries({ queryKey: [collection] });
            await $$queryClient.refetchQueries({ queryKey: [collection] });
        } catch (error) {
            console.error(error);
            throw error;
        }
    };
}
