import { MRT_Row } from 'material-react-table';
import { CircularProgress, DialogActions, DialogContent, DialogTitle, IconButton, Tooltip } from '@mui/material';
import { toProperFromCamel } from '../../../common/text/toProperCase';
import { UseMutateAsyncFunction, useMutation } from '@tanstack/react-query';
import { Form } from '../../Form';
import { Barcode } from '../../../dto/collections/Barcode';
import { IAddress, IBrand, IHashTag, IHashTagUsage, ILocationSegment, IMercariBrand } from '../../../dal/types';
import { BSON } from 'realm';
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

export type T1 = IAddress extends { _id: OID } ? true : false;
export type T2 = IBrand extends { _id: OID } ? true : false;

// eslint-disable-next-line @typescript-eslint/ban-types
export type FunctionProperties2<T extends AnyObject> = { [P in keyof T]: T[P] extends AnyFunction ? P : T[P] extends AnyFunction | undefined ? P : T[P] extends Function ? P : never }[keyof T];
export type BacklinkProperties<T extends AnyObject> = { [P in keyof T]: T[P] extends DBBacklink<infer R> ? P : never }[keyof T];
export type FP1 = FunctionProperties2<IBrand>;
export type FP2 = FunctionProperties2<IHashTag>;

export type DBProperties<T extends AnyObject> = Exclude<GetNonReadOnlyProperties<T>, FunctionProperties2<T> | BacklinkProperties<T>>;
export type DBP1 = DBProperties<IBrand>;
export type _Serialized<T, TRoot = true> = T extends BSON.ObjectId
    ? OID
    : T extends BSON.UUID
    ? BSON.UUID | string
    : T extends ArrayBuffer
    ? string | ArrayBuffer
    : T extends Date
    ? Date | string
    : T extends number
    ? number | string
    : T extends boolean
    ? boolean | string
    : T extends string
    ? string
    : T extends DBList<infer R>
    ? _Serialized<R, false>[]
    : T extends DBSet<infer R>
    ? _Serialized<R, false>[]
    : T extends DBDictionary<infer R>
    ? Record<string, _Serialized<R, false>>
    : T extends Record<string, any>
    ? T extends { _id: OID }
        ? TRoot extends false
            ? OID
            : { [P in DBProperties<T> as `${P}`]: Serialized<T[P], false> }
        : { [P in DBProperties<T> as `${P}`]: Serialized<T[P], false> }
    : never;
export type Serialized<T, TRoot = true> = undefined extends T ? _Serialized<T, TRoot> | null : _Serialized<T, TRoot>;
export type Unserialized<T extends AnyObject> = {
    [P in DBProperties<T>]: T[P] extends DBList<infer R> ? R[] : T[P] extends DBSet<infer R> ? R[] : T[P] extends DBDictionary<infer R> ? Record<string, R> : T[P];
};
type O1 = Serialized<IMercariBrand['_id']>;
type O2 = Serialized<IBrand['website']>;

type St1 = Serialized<IMercariBrand>;
type sT2 = Serialized<IBrand>;
type sT4 = _Serialized<IBrand>;

type st3 = Serialized<IHashTagUsage>;

export type ConvertToRealmFunction<T extends AnyObject> = (payload: _Serialized<T, true>) => Unserialized<T>;

type us1 = Unserialized<IMercariBrand>;
type us2 = Unserialized<IBrand>;
type us3 = Unserialized<IHashTag>;

type HTU = ConvertToRealmFunction<IHashTagUsage>;

const insertAction = {
    locationSegmentBarcode: (row: MRT_Row<ILocationSegment>) => (payload: { rawValue: string }) => () => {
        row.original.upcs.push(insertAction.barcode(payload) as any);
    },
    barcode: (payload: { rawValue: string }) => Barcode.ctor(payload.rawValue, false)
};

export function createRenderCreateRowDialogContentRHF<T extends AnyObject>(collection: string, insertAsync: UseMutateAsyncFunction<AnyObject, Error, { values: T }>) {
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
                if (ev.target.name == null) {
                    console.log(`no onBlur name`);
                    return;
                }
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
