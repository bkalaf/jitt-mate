import { setProperty } from '../common/object/setProperty';
import { toOID } from '../dal/toOID';
import { BSON } from 'realm';
import { charRange } from '../common/array/charRange';
import { is } from '../common/is';
import { convertString } from './convertString';

export function flattenPayload<T extends AnyObject>(values: T) {
    function innerFlatten(key: string, value: any): any {
        switch (typeof value) {
            case 'string':
                return value.trim().length === 0
                    ? undefined
                    : value === 'true' || value === 'false' ? Boolean(value)
                    : value.split('').every((x) => charRange('0', '9').concat('.').concat('-').includes(x))
                    ? Number.isInteger(parseFloat(value))
                        ? parseInt(value, 10)
                        : parseFloat(value)
                    : convertString(key, value);
            case 'number':
                return value;
            case 'bigint':
                return value;
            case 'boolean':
                return value;
            case 'symbol':
                return value;
            case 'undefined':
                return value;
            case 'object': {
                if (value instanceof BSON.ObjectId) return value;
                if (value instanceof BSON.UUID) return value;
                if (value instanceof Date) return value;
                if (value instanceof ArrayBuffer) return value;
                if (Array.isArray(value)) return value.map((x, ix) => innerFlatten(ix.toFixed(0), x));
                if (is.dbList(value)) return value.map((x, ix) => innerFlatten(ix.toFixed(0), x));
                if (is.dbDictionary(value)) return Object.fromEntries(Object.entries(value).map(([k, kv]) => [k, innerFlatten(k, kv)] as [string, any]));
                if (is.dbSet(value)) return value.map((x, ix) => innerFlatten(ix.toFixed(0), x));
                return Object.fromEntries(Object.entries(value ?? {}).map(([k, kv]) => [k, innerFlatten(k, kv)] as [string, any]));
            }
            case 'function':
                return undefined;
        }
    }
    const result = {};
    return Object.entries(values)
        .map((x) => (x[0] === '_id' ? ([x[0], toOID(x[1])] as [string, any]) : x))
        .reduce((pv, cv) => setProperty(cv[0])(pv)(innerFlatten(cv[0], cv[1])), result) as T;
}
