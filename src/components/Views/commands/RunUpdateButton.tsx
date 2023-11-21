import { Table } from '@tanstack/react-table';
import { Button } from '../../Buttons/Button';
import { faExclamationCircle } from '@fortawesome/pro-solid-svg-icons';
import { useCallback } from 'react';
import { toOID } from '../../../dal/toOID';
import { useLocalRealm } from '../../../routes/loaders/useLocalRealm';
import { IRealmEntity } from '../../../dal/types';
import { checkTransaction } from '../../../util/checkTransaction';
import { useInvalidator } from '../../../hooks/useInvalidator';
import { not } from '../../../common/not';

export function RunUpdateButton<T extends EntityBase>({ table }: { table: Table<T> }) {
    const db = useLocalRealm();
    const invalidate = useInvalidator(table.options.meta?.collectionName ?? '');
    const onClick = useCallback(() => {
        const collection = table.options.meta?.collectionName ?? '';
        const func = () => {
            Object.entries(table.getState().rowSelection)
                .filter((x) => x[1])
                .map((x) => toOID(x[0]))
                .filter((x) => x != null)
                .map((x) => db.objectForPrimaryKey<IRealmEntity<any>>(collection, x as any))
                .forEach((obj) => obj?.update());
        };
        checkTransaction(db)(func);
        invalidate.onSuccess();
    }, [db, invalidate, table]);
    const canClick = useCallback(() => table.getIsSomeRowsSelected(), [table]);
    return (
        <Button
            icon={faExclamationCircle}
            onClick={onClick}
            renderCondition={true}
            disabledCondition={not(canClick)}
            className='w-6 h-6 bg-transparent border border-sky-500 text-rose-700'
            title='Run update function for each selected row.'
        />
    );
}
