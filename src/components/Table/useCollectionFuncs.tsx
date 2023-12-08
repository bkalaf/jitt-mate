import { FieldValues } from 'react-hook-form-mui';
import { $initialCollection } from './creators/$initialCollection';
import { $convertToRealm } from './creators/$convertToRealm';
import { ConvertToRealmFunction } from './creators/createRenderCreateRowDialogContent';
import { useMemo } from 'react';
import { collections } from './collections';


export function useCollectionFuncs<T extends FieldValues>(objectType: string, ...prefixes: string[]) {
    const initialCollection = $initialCollection[objectType] as any as () => Promise<T>;
    const convertToRealm = $convertToRealm[objectType as keyof typeof $convertToRealm] as any as ConvertToRealmFunction<T>;
    const { getColumns } = collections[objectType as keyof typeof collections];
    return useMemo(
        () => ({
            init: initialCollection,
            convertPayload: convertToRealm,
            columns: getColumns(...prefixes) as DefinedMRTColumns<T>
        }),
        [convertToRealm, getColumns, initialCollection, prefixes]
    );
}
