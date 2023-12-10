import { MRT_ColumnDef, MRT_Row, MRT_RowData, MRT_TableInstance } from 'material-react-table';
import { FieldValues, FormProvider, Path, UseFormReturn, useForm } from 'react-hook-form-mui';
import { BSON } from 'realm';
import { $tagIs, is } from '../../../dal/is';
import { getProperty } from '../../Contexts/getProperty';
import { useCallback, useMemo } from 'react';
import { toHeader } from '../toHeader';
import { Box, CircularProgress, Dialog, DialogActions, DialogContent, DialogTitle, Divider, IconButton, List, ListItem, ListItemText, Modal, Tooltip } from '@mui/material';
import { collections } from '../collections';
import { useToggler } from '../../../hooks/useToggler';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCancel, faFloppyDisk, faPlusSquare, faTrashCan } from '@fortawesome/pro-solid-svg-icons';
import { ignore } from '../../../common/functions/ignore';
import { toProperFromCamel } from '../../../common/text/toProperCase';
import { useLocalRealm } from '../../../routes/loaders/useLocalRealm';
import { toEditFormInitializer } from '../creators/createRenderEditRowDialogContent';
import { $initialCollection } from '../creators/$initialCollection';
import { useMutation } from '@tanstack/react-query';
import { updateRecordProp, updateRecordProperty } from '../../../hooks/updateRecord';
import { useInvalidator } from '../../../hooks/useInvalidator';
import { OnBlurContext } from '../creators/OnBlurContext';
import { $convertToRealm } from '../creators/$convertToRealm';
import { $metas } from '../metas';
import { checkTransaction } from '../../../util/checkTransaction';

export type JITTMultiControlObjectComponentProps<TParent, TName extends Path<TParent>, TListOf> = {
    name: TName;
    header?: string;
    objectType: RealmObjects;
    ofObjectType: RealmObjects | RealmPrimitives;
    listType: ListTypeKind;
    ItemElement: React.FunctionComponent<{ data: TListOf }>;
};
export type JITTMultiControlObjectProps<TParent, TName extends Path<TParent>, TListOf, TPropertyName extends Path<TListOf>> = {
    name: TName;
    header?: string;
    objectType: RealmObjects;
    ofObjectType: RealmPrimitives | RealmObjects;
    listType: ListTypeKind;
    labelPropertyName?: TPropertyName;
};
export type JITTMultiControlPrimitiveProps<TParent, TName extends Path<TParent>, TListOf> = {
    name: TName;
    header?: string;
    objectType: RealmObjects;
    ofObjectType: RealmPrimitives | RealmObjects;
    listType: ListTypeKind;
    ItemElement: React.FunctionComponent<{ data: TListOf }>;
};
export type RealmJSType = string | number | boolean | ArrayBuffer | BSON.ObjectId | BSON.UUID | Date;
export type JITTMulitControlProps<TParent, TName extends Path<TParent>, TListOf, TPropertyName extends Path<TListOf> | undefined = undefined> =
    | JITTMultiControlObjectComponentProps<TParent, TName, TListOf>
    | JITTMultiControlPrimitiveProps<TParent, TName, TListOf>
    | JITTMultiControlObjectProps<TParent, TName, TListOf, TPropertyName & Path<TListOf>>;
export function JITTMultiControl<TParent, TName extends Path<TParent>, TListOf, TPropertyName extends Path<TListOf> | undefined = undefined>(outerProps: {
    name: TName;
    header?: string;
    objectType: RealmObjects;
    ofObjectType: RealmPrimitives | RealmObjects;
    listType: ListTypeKind;
    ItemElement?: React.FunctionComponent<{ data: TListOf }>;
    labelPropertyName?: TPropertyName;
}) {
    const MultiElement = (innerProps: Parameters<Exclude<MRT_ColumnDef<TParent & MRT_RowData, any>['Edit'], undefined>>[0]) => {
        console.log(`props`, outerProps);
        const { listType, name, objectType, ofObjectType, header } = outerProps;
        const labelPropertyName = (outerProps as { labelPropertyName?: string }).labelPropertyName;
        const ItemElement =
            (outerProps as { ItemElement?: React.FunctionComponent<{ data: TListOf }> }).ItemElement ??
            ((({ data }: { data: TListOf }) => <span>{getProperty((outerProps as any).labelPropertyName as string)(data as AnyObject)}</span>) as React.FunctionComponent<{ data: TListOf }>);
        console.log(`JITTDataStructure`, listType, objectType, ofObjectType, ItemElement, labelPropertyName, name, header);
        const { editingRow, creatingRow } = innerProps.table.getState();
        const isEditing = editingRow != null;
        const isCreating = creatingRow != null;
        const value = isEditing ? getProperty(name)(innerProps.row.original) ?? (listType === 'dictionary' ? {} : []) : listType === 'dictionary' ? {} : [];
        console.log('MULTI-value', value);
        const db = useLocalRealm();
        const { onSuccess } = useInvalidator(objectType);
        const onDelete = useCallback(
            (ix: number | string) => {
                const onClick = async () => {
                    if (isCreating) {
                        return innerProps.table.setCreatingRow((prev) => {
                            if (prev == null || typeof prev === 'boolean') return prev;
                            const valuesCache = prev._valuesCache;
                            const nextCache = { ...valuesCache, [name]: (valuesCache[name] as any[]).filter((x, i) => i !== ix) };
                            return { ...prev, _valuesCache: nextCache };
                        });
                    }
                    switch (listType) {
                        case 'dictionary': {
                            const dict = (innerProps.row.original[name] ?? {}) as DBDictionary<any>;
                            console.log(`dict`, dict);
                            const func = () => {
                                if (is.dbDictionary(dict)) {
                                    console.log('deleting dictionary entry');
                                    dict.remove(ix as string);
                                    return;
                                }
                                (dict as any)[ix] = undefined;
                                delete (dict as any)[ix];
                                // const result = convert(data as any)({} as any);
                                // Object.entries(result).forEach(([k, v]) => {
                                //     dict[k] = v;
                                // });
                            };
                            return checkTransaction(db)(func);
                        }
                        case 'list':
                        case 'set': {
                            const $set = (innerProps.row.original[name] ?? []) as DBSet<any> | DBList<any> | any[];
                            console.log('set', $set);
                            const func = () => {
                                if (is.dbSet($set)) {
                                    $set.delete($set[ix as number]);
                                    return;
                                }
                                if (is.dbList($set)) {
                                    $set.remove(ix as number);
                                    return;
                                }
                                innerProps.row.original[name] = $set.filter((_, i) => i !== (ix as number)) as any;
                            };
                            return checkTransaction(db)(func);
                        }
                    }
                };
                return () => onClick().then(onSuccess);
            },
            [db, innerProps.row.original, innerProps.table, isCreating, listType, name, onSuccess]
        );
        const onSubmit = useCallback(
            async (data: TListOf | Record<'value', TListOf>) => {
                const convertTo = $convertToRealm[ofObjectType as keyof typeof $convertToRealm];
                const convert = (data: AnyObject) => {
                    const value = convertTo(data as any);
                    return listType === 'dictionary' ? (prev: AnyObject) => ({ ...prev, [data.key]: value }) : (prev: AnyArray) => [...prev, value];
                };
                if (isCreating) {
                    return innerProps.table.setCreatingRow((prev) => {
                        if (prev == null || typeof prev === 'boolean') return prev;
                        const valuesCache = prev._valuesCache;
                        const nextCache = { ...valuesCache, [name]: convert(data as any)(valuesCache[name]) };
                        return { ...prev, _valuesCache: nextCache };
                    });
                }
                switch (listType) {
                    case 'dictionary': {
                        const dict = (innerProps.row.original[name] ?? {}) as DBDictionary<any>;
                        console.log(`dict`, dict);
                        const func = () => {
                            const result = convert(data as any)({} as any);
                            Object.entries(result).forEach(([k, v]) => {
                                dict[k] = v;
                            });
                        };
                        return checkTransaction(db)(func);
                    }
                    case 'list':
                    case 'set': {
                        const $set = (innerProps.row.original[name] ?? []) as DBSet<any>;
                        console.log('set', $set);
                        const func = () => {
                            const result = convert(data as any)([]) as any[];
                            (innerProps.row.original as any)[name] = [...$set, ...result];
                        };
                        return checkTransaction(db)(func);
                    }
                }
            },
            [db, isCreating, listType, name, ofObjectType, innerProps.row.original, innerProps.table]
        );
        const items = listType === 'dictionary' ? (Object.entries(value) as [string, TListOf][]) : (value as TListOf[]);
        const label = toHeader({ header: header }, name);
        const JITTListItemInsert = JITTListItemEntry<TParent>({ onSubmit, objectType, ofObjectType, listType });
        return (
            <fieldset name={name} className='flex flex-col w-full'>
                <legend>{label}</legend>
                <div className='flex flex-row justify-end'>
                    <JITTListItemInsert {...innerProps} />
                </div>
                <List disablePadding>
                    {items.map((item, ix) => {
                        const [index, value] = Array.isArray(item) ? (item as [string, TListOf]) : ([ix, item] as [number, TListOf]);
                        return (
                            <ListItem
                                disableGutters
                                disablePadding
                                key={index}
                                secondaryAction={
                                    <Tooltip title='Delete this row'>
                                        <IconButton color='error' onClick={onDelete(index)}>
                                            <FontAwesomeIcon icon={faTrashCan} className='block object-scale-down w-5 h-5' />
                                        </IconButton>
                                    </Tooltip>
                                }>
                                <ListItemText
                                    primary={typeof index === 'number' ? <ItemElement data={value} /> : <span>{index}</span>}
                                    secondary={typeof index === 'number' ? null : <ItemElement data={value} />}
                                />
                            </ListItem>
                        );
                    })}
                </List>
            </fieldset>
        );
    };
    return MultiElement;
}

export type JITTListItemEntryProps = {
    ofObjectType: RealmPrimitives | RealmObjects;
    listType: ListTypeKind;
    objectType: string;
    onSubmit: (value: any) => Promise<void>;
};
export function JITTListItemEntry<TParent>({ onSubmit, objectType, ofObjectType, listType }: JITTListItemEntryProps) {
    function JITTListItemEntryInner(props: Parameters<Exclude<MRT_ColumnDef<TParent & MRT_RowData, any>['Edit'], undefined>>[0]) {
        const columns =
            listType === 'dictionary'
                ? ([{ accessorKey: 'key', ...$metas.string({ propertyName: 'key', header: 'Key' }) }, ...collections[ofObjectType].getColumns('value')] as DefinedMRTColumns<TParent & MRT_RowData>)
                : (collections[ofObjectType].getColumns('value') as DefinedMRTColumns<TParent & MRT_RowData>);
        const EditControls = () => <>{columns.map(({ Edit }, ix) => (Edit == null ? <></> : <Edit key={ix} {...props} />))}</>;
        const [isOpen, toggleModal, showModal, hideModal] = useToggler(false);

        return (
            <>
                <JITTItemModal
                    onSubmit={onSubmit}
                    hideModal={hideModal}
                    isOpen={isOpen}
                    listType={listType}
                    ofObjectType={ofObjectType}
                    init={$initialCollection[ofObjectType]}
                    objectType={objectType}
                    EditControls={EditControls}></JITTItemModal>
                <Tooltip title='Insert a new record'>
                    <IconButton color='primary' type='button' onClick={showModal}>
                        <FontAwesomeIcon icon={faPlusSquare} className='block object-contain w-5 h-5' />
                    </IconButton>
                </Tooltip>
            </>
        );
    }
    return JITTListItemEntryInner;
}

export function JITTItemModal<TParent extends MRT_RowData, TListOf>({
    EditControls,
    onSubmit,
    isOpen,
    hideModal,
    ...props
}: {
    isOpen: boolean;
    hideModal: () => void;
    init: () => TListOf;
    ofObjectType: RealmPrimitives | RealmObjects;
    listType: ListTypeKind;
    objectType: string;
    // eslint-disable-next-line @typescript-eslint/ban-types
    EditControls: React.FunctionComponent<{}>;
    onSubmit: (value: any) => Promise<void>;
}) {
    const initializer: () => Promise<TListOf> = (async () => {
        return is.realmType.primitive(props.ofObjectType) ? { value: await props.init() } : await $initialCollection[props.ofObjectType]();
    }) as any;
    const formContext = useForm({
        criteriaMode: 'all' as const,
        mode: 'onBlur' as const,
        reValidateMode: 'onChange' as const,
        defaultValues: initializer
    });
    const { onSuccess } = useInvalidator(props.objectType);

    const $onSubmit = useCallback(
        (ev: React.FormEvent) => {
            ev.preventDefault();
            ev.stopPropagation();
            formContext.handleSubmit((data) => {
                console.log('onSubmit.data', data);
                onSubmit(data).then(onSuccess);
            })(ev);
        },
        [formContext, onSubmit, onSuccess]
    );
    const onBlur = useCallback(
        (name: string) => (ev: React.FocusEvent) => {
            console.log('onBlur', name, ev);
        },
        []
    );
    return (
        <OnBlurContext.Provider value={onBlur}>
            <Modal open={isOpen} onClose={hideModal}>
                <Box className='absolute top-1/2 left-1/2 -translate-x-1/2 w-[400px] bg-neutral-300 border-solid border-2 border-white shadow-lg pt-2 px-4 pb-3'>
                    <FormProvider {...formContext}>
                        <form onSubmit={$onSubmit}>
                            {/* <DialogTitle variant='h4' className='font-bold text-white bg-slate-600 font-rubik'>
                                {toProperFromCamel(props.objectType)}
                            </DialogTitle>
                            <Divider variant='middle' className='border-yellow-700' /> */}
                            {/* <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}></DialogContent> */}
                            <EditControls />
                            {/* <Divider variant='middle' className='border-yellow-700' /> */}
                            <div className='flex justify-end w-full'>
                                <Tooltip title='Cancel'>
                                    <IconButton aria-label='Cancel' onClick={hideModal}>
                                        <FontAwesomeIcon icon={faCancel} className='block object-contain w-8 h-8' />
                                    </IconButton>
                                </Tooltip>
                                <Tooltip title='Save'>
                                    <IconButton aria-label='Save' color='info' type='submit'>
                                        {formContext.formState.isSubmitting ? <CircularProgress size={18} /> : <FontAwesomeIcon icon={faFloppyDisk} className='block object-contain w-8 h-8' />}
                                    </IconButton>
                                </Tooltip>
                            </div>
                            {/* <DialogActions>
                                <Tooltip title='Cancel'>
                                    <IconButton aria-label='Cancel' onClick={hideModal}>
                                        <FontAwesomeIcon icon={faCancel} className='block object-contain w-8 h-8' />
                                    </IconButton>
                                </Tooltip>
                                <Tooltip title='Save'>
                                    <IconButton aria-label='Save' color='info' type='submit'>
                                        {formContext.formState.isSubmitting ? <CircularProgress size={18} /> : <FontAwesomeIcon icon={faFloppyDisk} className='block object-contain w-8 h-8' />}
                                    </IconButton>
                                </Tooltip>
                            </DialogActions> */}
                        </form>
                    </FormProvider>
                </Box>
            </Modal>
        </OnBlurContext.Provider>
    );
}
