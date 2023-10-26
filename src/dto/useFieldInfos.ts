import { PropertySchema } from 'realm';
import { useCtor } from '../routes/loaders/useCtor';
import { useCallback } from 'react';
import { normalizeSchemaProperty } from './MercariSubSubCategory';
import { any } from './any';

export function useFieldInfos(objectType: string) {
    const {
        schema: { properties }
    } = useCtor(objectType);
    const _containsType = useCallback(
        (toFind: string) => {
            const entries = Object.entries(properties)
            console.log(`entries`, entries);
            const normalized = entries
                .map(([k, v]) => [k, normalizeSchemaProperty(v)] as [string, PropertySchema]);
            console.log(`normalized`, normalized);
            const result = normalized.some(([k, v]) => {
                console.log(`toFind: ${toFind} key: ${k} result: ${v.type.endsWith(toFind)}`);
                return v.type.endsWith(toFind);
            });
            return result;
        },
        [properties]
    );
    const containsType = useCallback((...toFind: string[]) => {
        return toFind.map(_containsType).reduce(any, false);
    }, [_containsType]);
    const ofSingleType = useCallback(
        (toFind: string): FieldInfo[] => Object.entries(properties)
            .map(([k, v]) => [k, normalizeSchemaProperty(v)] as [string, PropertySchema])
            .filter(([k, v]) => v.type === toFind)
            .map(([k, v]) => [k, v.type, v.objectType] as [string, RealmTypes, string?]),
        [properties]
    );
    const ofType = useCallback((...toFind: string[]) => {
        return toFind.map(ofSingleType).reduce((pv, cv) => [...pv, ...cv], []);
    }, [ofSingleType]);
    return {
        ofType,
        containsType
    };
}
