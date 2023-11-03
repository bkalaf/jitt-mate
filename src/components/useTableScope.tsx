import { Table } from '@tanstack/react-table';
import { useTableMeta } from '../hooks/useTableMeta';
import { getRowIdFromIndex, getRowIdFromOID } from '../schema/getRowId';


export function useTableScope<T extends EntityBase>(table: Table<T>) {
    const { scope } = useTableMeta<T>(table);
    const canInsertObject = scope === 'top-level';
    const canAppendIndexValue = scope === 'list';
    const canAddRelationship = scope === 'links';

    const canEditIndexValue = scope === 'list';
    const canEditObject = scope === 'top-level' || scope === 'links';

    const canDeleteObject = scope === 'top-level';
    const canDeleteIndexValue = scope === 'list' || scope === 'links';

    const getRowId = scope === 'top-level' ? getRowIdFromOID : getRowIdFromIndex;

    return {
        canInsertObject,
        canDeleteIndexValue,
        canDeleteObject,
        canEditObject,
        canEditIndexValue,
        canAppendIndexValue,
        canAddRelationship,
        getRowId
    };
}
