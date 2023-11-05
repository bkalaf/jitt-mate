import { Column, Table } from '@tanstack/react-table';
import { FormProvider } from './Contexts/FormProvider';
import { useInsertRecord } from '../hooks/useInsertRecord';
import { EditFormControl } from './Table/Cells/DefaultEditBodyCell';
import { useLogger } from './Contexts/useLogger';
import { FormFooter } from './FormFooter';
import { compR } from '../common/functions/composeR';
import { IRealmEntity } from '../dal/types';

export function handlePayload<T>(data: T) {
    return { payload: data }
}

export function InsertForm<T extends IRealmEntity, TValue>({ onSuccess, getId, collectionName, table, resultant }: { collectionName: string; table: Table<T>; resultant?: (x: TValue) => void; onSuccess?: (x: TValue) => void; getId: (x: T) => string }) {
    const insertRecord = useInsertRecord<T>(collectionName);
    const logger = useLogger()
    return (
        <FormProvider submit={insertRecord} resultant={resultant} onSuccess={onSuccess}>
            <div className='grid grid-cols-2 gap-x-3 gap-y-1'>
                <h2 className='flex col-span-2'>{collectionName}</h2>
                {table
                    .getAllFlatColumns()
                    .filter((x) => {
                        // logger('column: '.concat(JSON.stringify(x, null, '\t')), 'defs');
                        // logger('column.getOwnPropertyNames: '.concat(JSON.stringify(Object.getOwnPropertyNames(x))), 'defs');
                        // logger('columnDef: '.concat(JSON.stringify(x.columnDef, null, '\t')), 'defs');
                        // logger('columnDef.getOwnPropertyNames: '.concat(JSON.stringify(Object.getOwnPropertyNames(x.columnDef))), 'defs');
                        return !['editRow', 'expandRow', 'selectRow', 'deleteRow'].includes((x.columnDef as any).accessorKey ?? x.columnDef.id ?? '');
                    })
                    .map((column, ix) => {
                        return <EditFormControl getId={getId} key={ix} column={column as any} table={table as any} />;
                    })}
                <FormFooter />
            </div>
        </FormProvider>
    );
}

