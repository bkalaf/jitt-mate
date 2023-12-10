import { MRT_Row, MRT_RowData, MRT_TableInstance } from 'material-react-table';
import { useCallback } from 'react';


export function useClearCRUD<T extends MRT_RowData>() {
    return useCallback(({ row, table }: { row?: MRT_Row<T>; table: MRT_TableInstance<T>; }) => {
        return () => {
            const { editingRow, creatingRow } = table.getState();
            const { setEditingRow, setCreatingRow } = table;
            if (editingRow != null) {
                setEditingRow(row ?? null);
            } else if (creatingRow != null) {
                setCreatingRow(row ?? null);
            }
        };
    }, []);
}
