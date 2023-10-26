import { Column } from '@tanstack/react-table';
import { useColumnMeta } from '../../hooks/useColumnMeta';

export function useObjectType<T extends EntityBase>(column: Column<T, any>) {
    const { objectType, labelProperty } = useColumnMeta<T>(column);
    if (objectType == null) throw new Error('no objectType');
    return objectType;
}
