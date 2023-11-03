import { Column, Table, flexRender } from '@tanstack/react-table';
import { handleCondition } from '../../Buttons/Button';
import { TRUE } from '../../../common/TRUE';

export function ControlLabel<T>({
    column,
    renderCondition,
    table,
    inputID,
    labelID
}: {
    renderCondition?: ConditionOrBoolean;
    inputID: string;
    labelID: string;
    column: Column<T, any>;
    table: Table<any>;
}) {
    return (
        handleCondition(renderCondition, TRUE) && (
            <label id={labelID} htmlFor={inputID} className='flex items-center justify-start w-full text-lg font-bold indent-2 font-fira-sans'>
                {flexRender(
                    column.columnDef.header,
                    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                    table
                        .getFlatHeaders()
                        .find((x: any) => x.column.columnDef.accessorKey ?? x.column.columnDef.id === (column.columnDef as any).accessorKey ?? column.columnDef.id)!
                        .getContext()
                )}
            </label>
        )
    );
}
