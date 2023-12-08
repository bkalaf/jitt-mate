import { MRT_Row } from 'material-react-table';
import { CircularProgress, DialogActions, DialogContent, DialogTitle, Divider, IconButton, Tooltip } from '@mui/material';
import { toProperFromCamel } from '../../../common/text/toProperCase';
import { UseMutateAsyncFunction, useMutation } from '@tanstack/react-query';
import { ConvertToRealmFunction, _Serialized } from './createRenderCreateRowDialogContent';
import { useCallback, useMemo } from 'react';
import { FormContainer, FormProvider, useForm, useFormContext } from 'react-hook-form-mui';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCancel, faFloppyDisk } from '@fortawesome/pro-solid-svg-icons';
import { ignore } from '../../../common/functions/ignore';
import { $convertToRealm } from './$convertToRealm';
import { updateRecordProperty } from '../../../hooks/updateRecord';
import { useInvalidator } from '../../../hooks/useInvalidator';
import { useClearCRUD } from '../../../hooks/useOnBlur';
import { useLocalRealm } from '../../../routes/loaders/useLocalRealm';
import { $initialCollection } from './$initialCollection';
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
            (name: string) => (ev: React.FocusEvent<HTMLInputElement>) => {
                mutateAsync({ propertyNames: [name], row: props.row });
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
