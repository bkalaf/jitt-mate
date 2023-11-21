import { useMemo } from 'react';
import { MRT_Row, MRT_RowData, MRT_TableInstance } from 'material-react-table';
import { ignore } from '../common/functions/ignore';

export function useEditingOrCreatingRow<T extends MRT_RowData>(table: MRT_TableInstance<T>, row: MRT_Row<T>) {
    const { creatingRow, editingRow } = table.getState();
    const isCreating = creatingRow?.id === row.id;
    const isEditting = editingRow?.id === row.id;
    return useMemo(() => (isCreating ? table.setCreatingRow : isEditting ? table.setEditingRow : ignore), [isCreating, isEditting, table.setCreatingRow, table.setEditingRow]);
}
