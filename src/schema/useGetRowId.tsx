import { useMemo } from 'react';
import { BSON } from 'realm';
import { getRowIdFromOID } from './getRowId';

export function useGetRowId<T extends EntityBase>() {
    return useMemo(() => getRowIdFromOID<T>, []);
}
