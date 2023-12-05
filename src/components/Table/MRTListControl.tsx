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
import { FieldValues, UseFormReturn } from 'react-hook-form-mui';

export function MRTListControl<T extends FieldValues>(
    name: string,
    objectType: string,
    ItemComponent: ({ payload }: { payload: T }) => string,
    convertPayload: (x: any) => T,
    editControls: React.FunctionComponent<{ context: UseFormReturn<T, any, undefined> }>,
    init: () => Promise<T>
) {
    return function MRT_ListControl(props: Parameters<NonNullable<MRT_ColumnDef<any, DBList<T>>['Edit']>>[0]) {
        const value = props.row.original[name] as DBList<T>;
        const data = value == null ? [] : Array.from(value.values());
        const db = useLocalRealm();
        const [open, toggleOpen] = useToggler(false);

        const invalidate = useInvalidator(objectType);
        const deleteItem = (ix: number) => () => {
            const func = () => {
                value.remove(ix);
            };
            checkTransaction(db)(func);
            invalidate.onSuccess();
        };
        const appendItem = (payload: T) => {
            const toInsert = convertPayload(payload);
            const func = () => {
                value.push(toInsert);
            };
            checkTransaction(db)(func);
            invalidate.onSuccess();
        };
        return (
            <div className='flex flex-col shadow-lg'>
                <div className='flex justify-between w-full'>
                    <Typography className='flex flex-grow' variant='caption'>
                        {props.column.columnDef.header}
                    </Typography>
                    <IconButton onClick={toggleOpen}>
                        <FontAwesomeIcon icon={faSquarePlus} className='block object-contain w-6 h-6' />
                    </IconButton>
                </div>
                <InsertItemModal init={init as any} EditControls={editControls} open={open} toggleOpen={toggleOpen} list={data as any} setList={(l) => (props.row.original[name] = l)} />
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
    };
}
