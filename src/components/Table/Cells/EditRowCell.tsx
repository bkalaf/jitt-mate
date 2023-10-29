import { useCallback, useMemo } from 'react';
import { CellContext } from '@tanstack/react-table';
import { useCollectionViewContext } from '../../../hooks/useCollectionViewContext';
import { faFloppyDisk, faPenCircle, faTrashCan } from '@fortawesome/pro-solid-svg-icons';
import { Button } from '../../Buttons/Button';
import { FALSE } from '../../../common/FALSE';
import { useDeleteOne } from '../../Contexts/useDeleteOne';
import { useGetRowId } from '../../../schema/useGetRowId';
import { $tagIs } from '../../../dal/is';

export function EditRowCell<T extends EntityBase>(props: CellContext<T, any>) {
    const context = useCollectionViewContext<T>();
    if (context == null) throw new Error('null context');
    const { setRowEdittable, isRowEdittable } = context;
    const showSave = useMemo(() => isRowEdittable(props.row), [isRowEdittable, props.row]);
    const onClick = useCallback(() => {
        if (showSave) {
            if (document.activeElement != null) {
                if ($tagIs.input(document.activeElement) || $tagIs.select(document.activeElement) || $tagIs.textarea(document.activeElement)) {
                    document.activeElement.blur();
                }
            } 
            setRowEdittable(undefined);
        } else {
            setRowEdittable(props.row);
        }
    }, [props.row, setRowEdittable, showSave]);
    const icon = useMemo(() => (showSave ? faFloppyDisk : faPenCircle), [showSave]);
    return (
        <Button type='button' disabledCondition={FALSE} onClick={onClick} icon={icon} />
        // <span className='flex items-center justify-center w-auto h-auto text-lg font-medium font-fira-sans'>
        //     <Button type='button' disabledCondition={FALSE} onClick={onClick} icon={icon} />
        // </span>
    );
}

export function DeleteRowCell<T extends EntityBase>(props: CellContext<T, any>) {
    const deleteOne = useDeleteOne();
    const getRowId = useGetRowId();    
    const onClick = useCallback(() => {
        deleteOne(getRowId(props.row.original));
    }, [deleteOne, getRowId, props.row.original]);
    return <Button type='button' disabledCondition={FALSE} onClick={onClick} icon={faTrashCan} />;
}
