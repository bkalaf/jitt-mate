import { Table } from '@tanstack/react-table';
import { Button } from './Buttons/Button';
import { faSquarePlus } from '@fortawesome/pro-solid-svg-icons';
import { useTableScope } from './useTableScope';


export function InsertRecordButton<T extends EntityBase>({ table, onInsert }: { table: Table<T>; onInsert: () => void; }) {
    const { canInsertObject } = useTableScope(table);
    return <Button icon={faSquarePlus} onClick={onInsert} renderCondition={canInsertObject} />;
}
