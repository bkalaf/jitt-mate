import { useCallback, useMemo } from 'react';
import { CellContext } from '@tanstack/react-table';
import { useCollectionViewContext } from '../../../hooks/useCollectionViewContext';
import { faFloppyDisk, faPenCircle } from '@fortawesome/pro-solid-svg-icons';
import { Button } from '../../Buttons/Button';
import { FALSE } from '../../../common/FALSE';
import { $tagIs } from '../../../dal/is';
import { useFormContext } from '../../Contexts/useFormContext';

export function SaveRowCell<T extends EntityBase>(props: CellContext<T, any>) {
    const icon = faFloppyDisk;
    const { formID } = useFormContext();
    return <Button type='submit' form={formID} disabledCondition={FALSE} icon={icon} className='w-4 h-4 bg-transparent border border-sky-500 text-slate-700' />;
}
export function EditRowCell<T extends EntityBase>(props: CellContext<T, any>) {
    const icon = faPenCircle;
    const context = useCollectionViewContext<T>();
    if (context == null) throw new Error('null context');
    const { setRowEdittable, isRowEdittable } = context;
    const onClick = useCallback(() => {
        setRowEdittable(props.row);
    }, [props.row, setRowEdittable]);
    return <Button type='button' disabledCondition={FALSE} icon={icon} onClick={onClick} className='w-4 h-4 bg-transparent border border-sky-500 text-slate-700' />;
}

export function EditSaveRowCell<T extends EntityBase>(props: CellContext<T, any>) {
    const context = useCollectionViewContext<T>();
    if (context == null) throw new Error('null context');
    const { setRowEdittable, isRowEdittable } = context;

    return isRowEdittable(props.row) ? <SaveRowCell {...props} /> : <EditRowCell {...props} />;
    // <span className='flex items-center justify-center w-auto h-auto text-lg font-medium font-fira-sans'>
    //     <Button type='button' disabledCondition={FALSE} onClick={onClick} icon={icon} />
    // </span>
}
