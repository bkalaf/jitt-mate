import { FormProvider, useForm } from 'react-hook-form-mui';
import { useCallback, useEffect } from 'react';
import { CircularProgress, DialogActions, DialogContent, IconButton, Tooltip } from '@mui/material';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCancel, faFloppyDisk } from '@fortawesome/pro-solid-svg-icons';
import { OnBlurContext } from '../creators/OnBlurContext';
import { MRT_RowData } from 'material-react-table';

export function renderCreateModal<T extends MRT_RowData>(init: () => Promise<any>, submit: (data: any) => Promise<void>) {
    function InnerRenderCreateModal(props: MRT_TableOptionFunctionParams<T, 'renderEditRowDialogContent'>) {
        const formContext = useForm({
            criteriaMode: 'all' as const,
            mode: 'onBlur' as const,
            reValidateMode: 'onChange' as const,
            defaultValues: init
        });
        const { isValid } = formContext.formState;
        useEffect(() => {
            console.log(`create form state change: isValid`, isValid);
        }, [isValid]);
        const onSubmit = useCallback((ev: React.FormEvent<HTMLFormElement>) => {
            ev.preventDefault();
            ev.stopPropagation();
            formContext.handleSubmit(submit)(ev);
            props.table.setCreatingRow(null);
        }, [formContext, props.table]);
        const onBlur = useCallback(
            (name: string) => (ev: React.FocusEvent<HTMLInputElement>) => {
                // if (ev.target.name == null) {
                //     console.log(`no onBlur name`);
                //     return;
                // }
                formContext.setValue(name, typeof ev === 'object' ? ev.target.value : (ev as any));
            },
            [formContext]
        );
        return (
            <OnBlurContext.Provider value={onBlur}>
                <FormProvider {...formContext}>
                    <form onSubmit={onSubmit}>
                        <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                            {props.internalEditComponents}
                        </DialogContent>
                        <DialogActions>
                            <Tooltip title='Cancel'>
                                <IconButton aria-label='Cancel' onClick={() => props.table.setCreatingRow(null)}>
                                    <FontAwesomeIcon icon={faCancel} className='block object-contain w-8 h-8' />
                                </IconButton>
                            </Tooltip>
                            <Tooltip title='Save'>
                                <IconButton aria-label='Save' color='info' type='submit'>
                                    {props.table.getState().isSaving ? <CircularProgress size={18} /> : <FontAwesomeIcon icon={faFloppyDisk} className='block object-contain w-8 h-8' />}
                                </IconButton>
                            </Tooltip>
                        </DialogActions>
                    </form>
                </FormProvider>
            </OnBlurContext.Provider>
        );
    }
    return InnerRenderCreateModal;
}
