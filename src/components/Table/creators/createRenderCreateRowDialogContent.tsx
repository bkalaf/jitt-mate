/* eslint-disable @typescript-eslint/no-explicit-any */
import { MRT_Row } from 'material-react-table';
import { CircularProgress, DialogActions, DialogContent, DialogTitle, IconButton, Tooltip } from '@mui/material';
import { toProperFromCamel } from '../../../common/text/toProperCase';
import { useMutation } from '@tanstack/react-query';
import { Barcode } from '../../../dto/collections/Barcode';
import { ILocationSegment } from '../../../dal/types';
import { $initialCollection } from './$initialCollection';
import { $convertToRealm } from './$convertToRealm';
import { faCancel, faFloppyDisk } from '@fortawesome/pro-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { ignore } from '../../../common/functions/ignore';
import { tableType } from '../../../hooks/tableType';
import { useInvalidator } from '../../../hooks/useInvalidator';
import { FormProvider, useForm } from 'react-hook-form-mui';
import { useCallback, useEffect } from 'react';
import { OnBlurContext } from './OnBlurContext';

const insertAction = {
    locationSegmentBarcode: (row: MRT_Row<ILocationSegment>) => (payload: { rawValue: string }) => () => {
        row.original.upcs.push(insertAction.barcode(payload) as any);
    },
    barcode: (payload: { rawValue: string }) => Barcode.ctor(payload.rawValue, false)
};

export function createRenderCreateRowDialogContentRHF<T extends AnyObject>(collection: string) {
    const initial = $initialCollection[collection];
    const convertTo = $convertToRealm[collection as keyof typeof $convertToRealm] as any as ConvertToRealmFunction<T>;
    function RenderCreateRowDialogContent(props: MRT_TableOptionFunctionParams<T, 'renderEditRowDialogContent'>) {
        // const initial = async () => props.row.original.toJSON() as T;
        console.log(`'internalEditComponents`, props.internalEditComponents);
        const { isSaving } = props.table.getState();
        const insert = tableType.collection({ collection: collection as any, propertyName: '', parentRow: props.row as  any, objectType: '' }).insert;
        const formContext = useForm({
            criteriaMode: 'all' as const,
            mode: 'onBlur' as const,
            reValidateMode: 'onChange' as const,
            defaultValues: initial
        });
        const { errors, isValid } = formContext.formState;
        useEffect(() => {
            console.log(`create form state change: isValid`, isValid);
        }, [isValid]);
        const { mutateAsync } = useMutation({
            mutationFn: insert,
            onSuccess: () => {
                onSuccess();
                props.table.setCreatingRow((prev) => {
                    console.log('setCreatingRow.prev', prev);
                    return null;
                });
            }
        });
        const onSubmit = formContext.handleSubmit((data: any) => {
            console.log(`onSuccess.errors`, errors);
            console.log(`isValid`, isValid);
            if (!isValid) return;
            console.log(`onSuccess.data`, data);
            const values = convertTo(data);
            console.log(`onSuccess.converted`, values);
            return mutateAsync(
                { values },
                {
                    onSuccess: () => {
                        props.table.setCreatingRow(prev => {
                            console.log('setCreatingRow.prev', prev);
                            return null;
                        });
                    }
                }
            );
        });
        const onBlur = useCallback(
            (name: string) => (ev: React.FocusEvent<HTMLInputElement>) => {
                // if (ev.target.name == null) {
                //     console.log(`no onBlur name`);
                //     return;
                // }
                formContext.setValue(name, typeof ev === 'object' ? ev.target.value : ev as any);
            },
            [formContext]
        );
        const { onSuccess } = useInvalidator(collection);

        return (
            <OnBlurContext.Provider value={onBlur}>
                <FormProvider {...formContext}>
                    <form onSubmit={onSubmit}>
                        <DialogTitle variant='h5' className='flex items-center justify-center font-rubik'>
                            {toProperFromCamel(collection)}
                        </DialogTitle>
                        <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                            {props.internalEditComponents} {/* or render custom edit components here */}
                        </DialogContent>
                        <DialogActions>
                            <Tooltip title='Cancel'>
                                <IconButton aria-label='Cancel' onClick={() => props.table.setCreatingRow(null)}>
                                    <FontAwesomeIcon icon={faCancel} className='block object-contain w-6 h-6' />
                                </IconButton>
                            </Tooltip>
                            <Tooltip title='Save'>
                                <IconButton aria-label='Save' color='info' type='submit'>
                                    {isSaving ? <CircularProgress size={18} /> : <FontAwesomeIcon icon={faFloppyDisk} className='block object-contain w-6 h-6' />}
                                </IconButton>
                            </Tooltip>
                        </DialogActions>
                    </form>
                </FormProvider>
            </OnBlurContext.Provider>
        );
        // <>
        //     <FormProvider
        //         defaultValues={initial}
        //         onValid={(data: T) => {
        //             console.log(`data`, data);
        //             const payload = convertTo(data as _Serialized<T, true>);
        //             console.log(`payload`, payload);
        //             return insertAsync(
        //                 { values: payload as T },
        //                 {
        //                     onSuccess: () => {
        //                         props.table.setCreatingRow(null);
        //                     }
        //                 }
        //             );
        //         }}
        //         onInvalid={(errors) => {
        //             alert('ERROR');
        //             const errs = Object.values(errors)
        //                 .map((e) => e?.message)
        //                 .join('\n');
        //             alert(errs);
        //         }}>
    }
    return RenderCreateRowDialogContent;
}
