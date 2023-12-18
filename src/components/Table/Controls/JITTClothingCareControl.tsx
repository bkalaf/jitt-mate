import { MRT_ColumnDef, MRT_RowData } from 'material-react-table';
import { useWatch } from 'react-hook-form-mui';
import { useDependencies } from '../../../hooks/useDependencies';
import { faEdit, faTrashCan } from '@fortawesome/pro-solid-svg-icons';
import { List, ListItem, ListItemText } from '@mui/material';
import { useToggler } from '../../../hooks/useToggler';
import { useCallback } from 'react';
import { catchError } from '../../catchError';
import { useInvalidateRoute } from '../../../hooks/useInvalidateRoute';
import { useCollectionRoute } from '../../../hooks/useCollectionRoute';
import { ClothingCareIndividualKeys, ClothingCareSectionKeys, JITTIconButton, ClothingCareMapNoCategory } from '../clothingCareMeta';
import { JITTClothingCareDialog } from '../Dialogs/JITTClothingCareDialog';

export function JITTClothingCareControl<T extends MRT_RowData>(initialDisable = true, ...dependencies: IDependency[]) {
    function InnerJITTClothingCareControl(props: Parameters<Exclude<MRT_ColumnDef<T, DBSet<ClothingCareIndividualKeys<ClothingCareSectionKeys>>>['Edit'], undefined>>[0]) {
        const { control, disabled, label, name } = useDependencies(props, initialDisable, ...dependencies);
        const value = useWatch({
            control,
            name: name
        });
        console.log(`watchedValue`, value);
        const cellValue = props.cell.getValue();
        console.log(`cellValue`, cellValue);
        const [isOpen, toggleOpen, showModal, hideModal] = useToggler(false);
        const onSuccess = useInvalidateRoute();
        const objectType = useCollectionRoute();
        const onDelete = useCallback(
            (ix: number) => {
                return () => {
                    try {
                        cellValue.delete(cellValue[ix]);
                        onSuccess.onSuccess();
                    } catch (error) {
                        catchError(error);
                        console.error('delete failed');
                    }
                };
            },
            [cellValue, onSuccess]
        );
        return disabled ? null : (
            <fieldset className='flex w-full' name={name}>
                <legend className='flex flex-row justify-between'>
                    <span className='inline-flex'>{label}</span>
                    <JITTIconButton className='w-5 h-5' Icon={faEdit} color='secondary' title='Edit this record' onClick={toggleOpen} />
                </legend>
                <JITTClothingCareDialog isOpen={isOpen} hideModal={hideModal} dbSet={cellValue} onSuccess={onSuccess} name={name} objectType={objectType} row={props.row} />
                <List disablePadding>
                    {cellValue.map((item, ix) => {
                        const { text } = ClothingCareMapNoCategory[item];
                        return (
                            <ListItem
                                disableGutters
                                disablePadding
                                key={ix}
                                secondaryAction={<JITTIconButton Icon={faTrashCan} color='warning' title='Delete this item' className='w-5 h-5' onClick={onDelete(ix)} />}>
                                <ListItemText primary={text} />
                            </ListItem>
                        );
                    })}
                </List>
            </fieldset>
        );
    }
    return InnerJITTClothingCareControl;
}
