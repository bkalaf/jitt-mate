import { Table } from '@tanstack/react-table';
import { Button } from '../../Buttons/Button';
import { faSquarePlus } from '@fortawesome/pro-solid-svg-icons';
import { useTableScope } from '../../useTableScope';

export function InsertRecordButton<T extends EntityBase>({ table, onInsert }: { table: Table<T>; onInsert: () => void; }) {
    const { canInsertObject } = useTableScope(table);
    return <Button icon={faSquarePlus} onClick={onInsert} renderCondition={canInsertObject} className='w-6 h-6 bg-transparent border border-sky-500 text-rose-700' />;
}

