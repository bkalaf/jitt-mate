import { Table } from '@tanstack/react-table';
import { Button } from '../../Buttons/Button';
import { faTimesCircle } from '@fortawesome/pro-solid-svg-icons';
import { useCallback } from 'react';


export function ClearSelectionButton<T extends EntityBase>({ table }: { table: Table<T>; }) {
    const clearSelection = useCallback(() => table.resetRowSelection(true), []);
    const enabled = useCallback(() => table.getIsSomeRowsSelected(), []);
    return (
        <Button
            icon={faTimesCircle}
            onClick={clearSelection}
            renderCondition={true}
            disabledCondition={!enabled()}
            className='w-6 h-6 bg-transparent border border-sky-500 text-rose-700'
            title='Clear the current selected rows.'
        />
    );
}
