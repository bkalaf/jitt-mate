import { Table } from '@tanstack/react-table';
import { useCallback } from 'react';
import { Button } from '../../Buttons/Button';
import { faTrashCan } from '@fortawesome/pro-solid-svg-icons';
import { useTableScope } from '../../useTableScope';
import { useDeleteMany } from '../../../hooks/useDeleteMany';

export function DeleteSelectionButton<T extends EntityBase>({ table }: { table: Table<T> }) {
    const { canDeleteObject } = useTableScope(table);
    const deleteMany = useDeleteMany(table.options.meta?.collectionName ?? '');
    const onClick = useCallback(() => {
        deleteMany({
            payload: Object.entries(table.getState().rowSelection)
                .filter((tuple) => tuple[1])
                .map((tuple) => tuple[0])
        });
    }, [deleteMany, table]);
    const rowsSelected = table.getIsSomeRowsSelected;
    return (
        <Button
            icon={faTrashCan}
            onClick={onClick}
            renderCondition={canDeleteObject}
            disabledCondition={!rowsSelected()}
            type='button'
            className='w-6 h-6 bg-transparent border border-sky-500 text-rose-700'
        />
    );
}
