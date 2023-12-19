/* eslint-disable @typescript-eslint/no-explicit-any */
import { MRT_Row } from 'material-react-table';
import { CircularProgress, DialogActions, DialogContent, DialogTitle, Divider, IconButton, Tooltip } from '@mui/material';
import { toProperFromCamel } from '../../../common/text/toProperCase';
import { useMutation } from '@tanstack/react-query';
import { useCallback, useMemo } from 'react';
import { FormProvider, useForm } from 'react-hook-form-mui';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCancel, faFloppyDisk } from '@fortawesome/pro-solid-svg-icons';
import { ignore } from '../../../common/functions/ignore';
import { updateRecordProperty } from '../../../hooks/updateRecord';
import { useInvalidator } from '../../../hooks/useInvalidator';
import { useLocalRealm } from '../../../hooks/useLocalRealm';
import { OnBlurContext } from './OnBlurContext';

export function toEditFormInitializer<T extends AnyObject>(row: MRT_Row<T>) {
    return () => Promise.resolve(row.original.toJSON() as T);
}

export function createRenderEditRowDialogContentRHF<T extends AnyObject>(collection: string) {
    function RenderEditRowDialogContent(props: MRT_TableOptionFunctionParams<T, 'renderEditRowDialogContent'>) {
        const db = useLocalRealm();
        const initializer = useMemo(() => toEditFormInitializer(props.row), [props.row]);
        const formContext = useForm({
            criteriaMode: 'all' as const,
            mode: 'onBlur' as const,
            reValidateMode: 'onChange' as const,
            defaultValues: initializer
        });
        const { dirtyFields } = formContext.formState;
        const propertyNames = Object.entries(dirtyFields)
            .filter((x) => x[1])
            .map((x) => x[0]);
        console.log(`dirtyProperties`, propertyNames);
        const onSubmit = formContext.handleSubmit((data: any) => {
            console.log(`onSuccess.data`, data);
            return mutateAsync(
                { propertyNames, row: props.row },
                {
                    onSuccess: () => {
                        props.table.setEditingRow(null);
                    }
                }
            );
        });
        const { onSuccess } = useInvalidator(collection);
        const { mutateAsync } = useMutation({
            mutationFn: updateRecordProperty<T>(db, collection, formContext as any),
            onSuccess: () => {
                onSuccess();
            }
        });
        const { isSaving } = props.table.getState();
        const onBlur = useCallback(
            (name: string) => () => {
                mutateAsync({ propertyNames: [name], row: props.row });
                // const row = props.row;
                // console.log('props.row', props.row, 'ev.target.value', ev.target.value);
                // const value = formContext.watch(name as any);
                // console.log('watchedvalue', value);
                // row._valuesCache[name as keyof typeof row._valuesCache] = value;
                // props.table.setEditingRow(row);
            },
            [mutateAsync, props.row]
        );
        return (
            <OnBlurContext.Provider value={onBlur}>
                <FormProvider
                    {...formContext}
                    >
                    <form onSubmit={onSubmit}>
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
                    </form>
                </FormProvider>
            </OnBlurContext.Provider>
        );
    }
    return RenderEditRowDialogContent;
}
