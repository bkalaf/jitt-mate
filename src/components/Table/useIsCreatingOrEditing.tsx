import { MRT_TableInstance } from 'material-react-table';
import { FieldValues } from 'react-hook-form-mui';


export function useIsCreatingOrEditing<T extends FieldValues>(table: MRT_TableInstance<T>) {
    const { editingRow, creatingRow } = table.getState();
    return {
        isCreating: creatingRow != null,
        isEditing: editingRow != null
    };
}
