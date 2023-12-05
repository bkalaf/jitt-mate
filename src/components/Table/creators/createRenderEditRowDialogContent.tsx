import { MRT_Row } from 'material-react-table';
import { CircularProgress, DialogActions, DialogContent, DialogTitle, Divider, IconButton, Tooltip } from '@mui/material';
import { toProperFromCamel } from '../../../common/text/toProperCase';
import { UseMutateAsyncFunction } from '@tanstack/react-query';
import { ConvertToRealmFunction, _Serialized } from './createRenderCreateRowDialogContent';
import { useMemo } from 'react';
import { FormContainer } from 'react-hook-form-mui';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCancel, faFloppyDisk } from '@fortawesome/pro-solid-svg-icons';
import { ignore } from '../../../common/functions/ignore';
import { $convertToRealm } from './$convertToRealm';

export function toEditFormInitializer<T extends AnyObject>(row: MRT_Row<T>) {
    return () => Promise.resolve(row.original.toJSON() as T);
}

export function createRenderEditRowDialogContentRHF<T extends AnyObject>(collection: string, editAsync: UseMutateAsyncFunction<void, Error, T>) {
    function RenderEditRowDialogContent(props: MRT_TableOptionFunctionParams<T, 'renderEditRowDialogContent'>) {
        // const initializer = initialCollection[collection as keyof typeof initialCollection] as () => Promise<T>;
        const initializer = useMemo(() => toEditFormInitializer(props.row), [props.row])
        const convertTo = $convertToRealm[collection as keyof typeof $convertToRealm] as any as ConvertToRealmFunction<T>;
        const { isSaving } = props.table.getState();
        return (
            <FormContainer
                mode='onBlur'
                criteriaMode='all'
                reValidateMode='onChange'
                defaultValues={initializer}
                onSuccess={(data: T) => {
                    console.info(`onSuccess.data`, data);
                    const payload = convertTo(data as _Serialized<T, true>);
                    console.info(`onSuccess.payload`, payload);

                    return editAsync(payload as T, {
                        onSuccess: () => {
                            props.table.setEditingRow(null);
                        }
                    });
                }}>
                <>
                    <DialogTitle variant='h4' className='font-bold text-white bg-slate-600 font-rubik'>
                        {toProperFromCamel(collection)}
                    </DialogTitle>
                    <Divider variant='middle' className='border-yellow-700' />
                    <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>{props.internalEditComponents}</DialogContent>
                    <Divider variant='middle' className='border-yellow-700' />
                    <DialogActions>
                        <Tooltip title='Cancel'>
                            <IconButton aria-label='Cancel' onClick={() => (props.table.options.onCreatingRowCancel ?? ignore)(props)}>
                                <FontAwesomeIcon icon={faCancel} className='block object-contain w-8 h-8' />
                            </IconButton>
                        </Tooltip>
                        <Tooltip title='Save'>
                            <IconButton aria-label='Save' color='info' type='submit'>
                                {isSaving ? <CircularProgress size={18} /> : <FontAwesomeIcon icon={faFloppyDisk} className='block object-contain w-8 h-8' />}
                            </IconButton>
                        </Tooltip>
                    </DialogActions>
                </>
            </FormContainer>
        );
    }
    return RenderEditRowDialogContent;
}
