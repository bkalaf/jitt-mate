import { MRT_EditActionButtons } from 'material-react-table';
import { DialogActions, DialogContent, DialogTitle } from '@mui/material';
import { toProperFromCamel } from '../../../common/text/toProperCase';
import { Form } from '../../Form';
import { UseMutateAsyncFunction } from '@tanstack/react-query';
import { ConvertToRealmFunction, _Serialized, convertToRealm, initialCollection } from './createRenderCreateRowDialogContent';
import { cloneElement, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { FormContainer } from 'react-hook-form-mui';

export function createRenderEditRowDialogContentRHF<T extends AnyObject>(collection: string, editAsync: UseMutateAsyncFunction<void, Error, T>) {
    function RenderEditRowDialogContent(props: MRT_TableOptionFunctionParams<T, 'renderEditRowDialogContent'>) {
        console.log('collection', collection);
        const initializer = initialCollection[collection as keyof typeof initialCollection] as () => Promise<T>;
        const convertTo = convertToRealm[collection as keyof typeof convertToRealm] as any as ConvertToRealmFunction<T>;
        console.log(`initialForm`, props.row.original.toJSON());
        const original = async () => props.row.original;
        const initial = async () => props.row.original.toJSON() as T;
        console.log(`internalEditComponents`, props.internalEditComponents);
        original().then((x) => console.log(`original`, x));
        initial().then((x) => console.log(`initial`, x));
        initializer().then((x) => console.log(`initializer`, x));
        return (
            <>
                <FormContainer
                    defaultValues={() => Promise.resolve(props.row.original.toJSON() as T)}
                    onSuccess={(data: T) => {
                        const payload = convertTo(data as _Serialized<T, true>);
                        return editAsync(
                            payload as T,
                            {
                                onSuccess: () => {
                                    props.table.setEditingRow(null);
                                }
                            }
                        );
                    }}>
                    <DialogTitle className='flex items-center justify-center font-rubik'>{toProperFromCamel(collection)}</DialogTitle>
                    <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                        {props.internalEditComponents} {/* or render custom edit components here */}
                    </DialogContent>
                    <DialogActions>
                        <MRT_EditActionButtons variant='icon' table={props.table} row={props.row} />
                    </DialogActions>
                </FormContainer>
            </>
        );
    }
    return RenderEditRowDialogContent;
}
