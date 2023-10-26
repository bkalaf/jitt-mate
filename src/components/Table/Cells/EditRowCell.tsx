import { useCallback, useMemo } from 'react';
import { CellContext } from '@tanstack/react-table';
import { useCollectionViewContext } from '../../useCollectionViewContext';
import { faFloppyDisk, faPenCircle } from '@fortawesome/pro-solid-svg-icons';
import { Button } from '../../Buttons/Button';
import { $tagIs } from '../../../dto/is';
import { FALSE } from '../../../common/FALSE';

export function EditRowCell<T extends EntityBase>(props: CellContext<T, any>) {
    const { setEdittingRow, isEdittable, isInEditMode } = useCollectionViewContext<T>();
    const showSave = useMemo(() => isEdittable(props.row), [isEdittable, props.row]);
    const onClick = useCallback(() => {
        if (showSave) {
            if (document.activeElement != null) {
                if ($tagIs.input(document.activeElement) || $tagIs.select(document.activeElement) || $tagIs.textarea(document.activeElement)) {
                    document.activeElement.blur();
                }
            } 
            setEdittingRow(undefined);
        } else {
            setEdittingRow(props.row);
        }
    }, [props.row, setEdittingRow, showSave]);
    const icon = useMemo(() => (showSave ? faFloppyDisk : faPenCircle), [showSave]);
    return (
        <Button type='button' disabledCondition={FALSE} onClick={onClick} icon={icon} />
        // <span className='flex items-center justify-center w-auto h-auto text-lg font-medium font-fira-sans'>
        //     <Button type='button' disabledCondition={FALSE} onClick={onClick} icon={icon} />
        // </span>
    );
}
