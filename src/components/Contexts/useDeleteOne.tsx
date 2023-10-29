import { useCallback } from 'react';
import { useDeleteMany } from '../../hooks/useDeleteMany';

export function useDeleteOne() {
    const deleteMany = useDeleteMany();
    return useCallback((oid: OID) => {
        deleteMany({ payload: [oid] });
    }, [deleteMany]);
}
