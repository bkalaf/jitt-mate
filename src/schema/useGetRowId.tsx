import { useMemo } from 'react';
import { BSON } from 'realm';
import { getRowId } from './getRowId';

export function useGetRowId<T extends { _id: BSON.ObjectId }>() {
    return useMemo(() => getRowId<T>, []);
}
