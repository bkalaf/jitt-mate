import { Table } from '@tanstack/react-table';
import { useCallback } from 'react';
import { useOverlayContext } from '../../Contexts/useOverlayContext';
import { InsertForm } from '../../InsertForm';


export function useLoadInsertForm<T>(objectType: string, table: Table<T>, getId: (x: T) => string, resultant?: (x: T) => void) {
    const { pushFrame, popFrame } = useOverlayContext();
    const onInsert = useCallback(() => {
        pushFrame((InsertForm<T, T>), { getId, resultant, collectionName: objectType, table, onSuccess: popFrame });
    }, [getId, objectType, popFrame, pushFrame, resultant, table]);
    return onInsert;
}
