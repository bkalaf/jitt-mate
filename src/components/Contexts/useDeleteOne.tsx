import { useCallback } from 'react';
import { useDeleteMany } from '../../hooks/useDeleteMany';

export function useDeleteOne(collection: string) {
    const deleteMany = useDeleteMany(collection);
    return useCallback((oid: OID) => {
        deleteMany({ payload: [oid] });
    }, [deleteMany]);
}
