/* eslint-disable @typescript-eslint/no-explicit-any */
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { IconButton, List, ListItem, ListItemText, Typography } from '@mui/material';
import { faTrashCan } from '@fortawesome/pro-duotone-svg-icons';
import { useLocalRealm } from '../../routes/loaders/useLocalRealm';
import { MRT_ColumnDef } from 'material-react-table';
import { faSquarePlus } from '@fortawesome/pro-solid-svg-icons';
import * as React from 'react';
import { InsertItemModal } from './InsertItemModal';
import { checkTransaction } from '../../util/checkTransaction';
import { useInvalidator } from '../../hooks/useInvalidator';
import { useToggler } from '../../hooks/useToggler';
import { FieldValues } from 'react-hook-form-mui';
import { _Serialized } from './creators/createRenderCreateRowDialogContent';
import { useCollectionFuncs } from './useCollectionFuncs';
import { useEditControls } from '../../hooks/useEditControls';
import { useIsCreatingOrEditing } from './useIsCreatingOrEditing';
import { is } from '../../dal/is';

export type RHFM_ListControlProps<T> = {
    propertyName: string;
    objectType: RealmObjects | RealmPrimitives;
    parentObjectType: RealmObjects;
    ItemComponent: ({ payload }: { payload: T }) => string;
};

export function RHFMListControl<T extends FieldValues, TListOf>({ ItemComponent, objectType, parentObjectType, propertyName }: RHFM_ListControlProps<TListOf>) {
    // name: string,
    // objectType: string,
    // ItemComponent: ({ payload }: { payload: T }) => string,
    // convertPayload: (x: any) => T,
    // editControls: React.FunctionComponent<{ context: UseFormReturn<T, any, undefined> }>,
    // init: () => Promise<T>

    function MRT_ListControl(props: Parameters<Exclude<MRT_ColumnDef<any, any>['Edit'], undefined>>[0]) {
        const { columns, init, convertPayload } = useCollectionFuncs<TListOf & FieldValues>(objectType);
        const EditControls = useEditControls<TListOf>(columns);
        const { isEditing, isCreating } = useIsCreatingOrEditing(props.table);
        const $value = React.useRef<DBList<TListOf> | undefined>();
        React.useEffect(() => {
            const func = (() => {
                return (
                    isCreating
                        ? () => Promise.resolve([])
                        : isEditing
                        ? () => Promise.resolve(props.row.original[propertyName as keyof T])
                        : () => Promise.reject(new Error('not Editing or Creating but in Edit Component'))
                ) as () => Promise<DBList<TListOf>>;
            })();
            func().then((x) => ($value.current = x));
        }, [init, isCreating, isEditing, props.row.original]);
        const data = $value.current == null ? [] : is.dbSet($value.current) ? Array.from($value.current?.values()) : is.dbList($value.current) ? Array.from($value.current.values()) : is.array($value.current) ? $value.current : [];
        const db = useLocalRealm();
        const [isInsertItemModalOpen, toggleInsertItemModal] = useToggler(false);

        const invalidate = useInvalidator(parentObjectType);
        const deleteItem = (ix: number) => () => {
            const func = () => {
                $value.current?.remove(ix);
            };
            checkTransaction(db)(func);
            invalidate.onSuccess();
        };
        const Modal = InsertItemModal({
            open: isInsertItemModalOpen,
            toggleOpen: toggleInsertItemModal,
            EditControls,
            init: init as any,
            list: data as any,
            setList: (l) => (props.row.original[propertyName] = l)
        });
        return (
            <div className='flex flex-col shadow-lg'>
                <div className='flex justify-between w-full'>
                    <Typography className='flex flex-grow' variant='caption'>
                        {props.column.columnDef.header}
                    </Typography>
                    <IconButton onClick={toggleInsertItemModal}>
                        <FontAwesomeIcon icon={faSquarePlus} className='block object-contain w-6 h-6' />
                    </IconButton>
                </div>
                <Modal {...props} />
                <List dense>
                    {data.map((item, ix) => (
                        <ListItem
                            key={ix}
                            secondaryAction={
                                <IconButton className='flex' onClick={deleteItem(ix)}>
                                    <FontAwesomeIcon icon={faTrashCan} className='block object-contain w-6 h-6' />
                                </IconButton>
                            }>
                            <ListItemText primary={ItemComponent({ payload: item })} />
                        </ListItem>
                    ))}
                </List>
            </div>
        );
    }

    return MRT_ListControl;
}
