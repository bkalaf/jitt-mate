import { PropertySchema, PropertyTypeName } from 'realm';
import { cleanup, is } from '../common/is';

export const ifList = (s: string): string | PropertySchema => (is.realmType.list(s) ? { type: 'list', objectType: cleanup(s) } : s);
export const ifOpt = (s: string): string | PropertySchema => {
    const result = is.realmType.optional(s) ? { type: cleanup(s) as Realm.PropertyTypeName, optional: true } : s;
    if (!is.string(result) && is.realmType.primitive(result.type)) {
        return result;
    }
    if (is.string(result)) return result;
    if (['list', 'dictionary', 'set', 'linkingObjects'].includes(result.type)) return result;
    return { optional: result.optional, type: 'object', objectType: result.type };
};
export const ifDictionary = (s: string): string | PropertySchema => (is.realmType.dictionary(s) ? { type: 'dictionary', objectType: cleanup(s) } : s);
export const ifSet = (s: string): string | PropertySchema => (is.realmType.set(s) ? { type: 'set', objectType: cleanup(s) } : s);
export const ifPrimitive = (s: string): PropertySchema | string => (is.realmType.primitive(s) ? { type: s as PropertyTypeName, optional: false } : s);

export const handleIf = (func: (s: string) => string | PropertySchema) => (item: string | PropertySchema) => is.string(item) ? func(item) : item;
export function normalizeSchemaProperty(sp: string | PropertySchema): PropertySchema {
    const result = [ifOpt, ifList, ifDictionary, ifSet, ifPrimitive].map(handleIf).reduce((pv, cv) => cv(pv), sp);
    if (is.string(result)) throw new Error(`could not normalize: ${sp}`);
    return result as PropertySchema;
}
