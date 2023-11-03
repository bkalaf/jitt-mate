import { useCallback } from 'react';
import { CellContext } from '@tanstack/react-table';
import { faTrashCan } from '@fortawesome/pro-solid-svg-icons';
import { Button } from '../../Buttons/Button';
import { FALSE } from '../../../common/FALSE';
import { useDeleteOne } from '../../Contexts/useDeleteOne';
import { useGetRowId } from '../../../schema/useGetRowId';


export function DeleteRowCell<T extends EntityBase>(props: CellContext<T, any>) {
    const deleteOne = useDeleteOne(props.table.options.meta?.collectionName ?? '');
    const getRowId = useGetRowId();
    const onClick = useCallback(() => {
        deleteOne(getRowId(props.row.original));
    }, [deleteOne, getRowId, props.row.original]);
    return <Button type='button' disabledCondition={FALSE} onClick={onClick} icon={faTrashCan} className='w-4 h-4 bg-transparent border border-sky-500 text-slate-700' />;
}
