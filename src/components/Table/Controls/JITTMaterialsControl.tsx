import { useFormContext } from 'react-hook-form-mui';
import { useMutation } from '@tanstack/react-query';
import { useLocalRealm } from '../../../routes/loaders/useLocalRealm';
import { useDependencies } from '../../../hooks/useDependencies';
import { MRT_ColumnDef, MRT_RowData } from 'material-react-table';
import { IMaterialComposition } from '../../../dal/types';
import { useCallback } from 'react';
import { updateRecordProp } from '../../../hooks/updateRecord';
import { useCollectionRoute } from '../../../hooks/useCollectionRoute';
import { useInvalidator } from '../../../hooks/useInvalidator';
import { is } from '../../../dal/is';
import { checkTransaction } from '../../../util/checkTransaction';
import { JITTIconButton } from '../clothingCareMeta';
import { faPlusSquare, faTrashCan } from '@fortawesome/pro-solid-svg-icons';
import { List, ListItem, ListItemText } from '@mui/material';
import { useToggler } from '../../../hooks/useToggler';
import { removeProperty } from './removeProperty';
import { JITTMaterialDialog } from './JITTMaterialDialog';
import { updateDictionary } from './JITTLookupControl';

export function JITTMaterialsControl<T extends MRT_RowData>(initialDisable = false, ...dependencies: IDependency[]) {
    function InnerJITTMaterialsControl(props: Parameters<Exclude<MRT_ColumnDef<T, DBDictionary<IMaterialComposition> | Record<string, IMaterialComposition>>['Edit'], undefined>>[0]) {
        const dictionary = Object.entries(props.cell.getValue() ?? {});
        const collection = useCollectionRoute();
        const db = useLocalRealm();
        const onSuccess = useInvalidator(collection);
        const { name, label } = useDependencies(props, initialDisable, ...dependencies);
        const { mutateAsync } = useMutation({
            mutationFn: updateRecordProp(collection, db),
            ...onSuccess
        });
        const onDelete = useCallback(
            (index: string) => {
                return () => {
                    const func = () => {
                        const oldValue = props.cell.getValue();
                        const newValue = is.dbDictionary(oldValue) ? oldValue.remove(index) : removeProperty(oldValue, index);
                        mutateAsync({
                            propertyName: name,
                            _id: props.row.original._id,
                            value: newValue
                        });
                    };
                    checkTransaction(db)(func);
                };
            },
            [db, mutateAsync, name, props.cell, props.row.original._id]
        );
        const { creatingRow } = props.table.getState();
        const formContext = useFormContext();
        const { mutateAsync: insertAsync } = useMutation({
            mutationFn: updateDictionary(db, collection, name, formContext, creatingRow),
            ...onSuccess
        });
        const [isOpen, toggleOpen, , hideModal] = useToggler(false);
        const Dialog = JITTMaterialDialog({ isOpen, hideModal, onInsert: insertAsync, _id: props.row.id });
        return (
            <fieldset>
                <legend className='flex flex-row'>
                    <span className='inline-flex'>{label}</span>
                    <JITTIconButton color='primary' Icon={faPlusSquare} title='Insert' onClick={toggleOpen} className='w-5 h-5' />
                </legend>
                <Dialog {...(props as any)} />
                <List disablePadding>
                    {dictionary.map(([k, v], ix) => (
                        <ListItem
                            key={ix}
                            disableGutters
                            disablePadding
                            secondaryAction={<JITTIconButton color='error' Icon={faTrashCan} title='Delete this row' onClick={onDelete(k)} className='w-5 h-5' />}>
                            <ListItemText primary={k} secondary={v.toOutput} />
                        </ListItem>
                    ))}
                </List>
            </fieldset>
        );
    }
    return InnerJITTMaterialsControl;
}
