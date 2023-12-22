import { MRT_ColumnDef, MaterialReactTable, useMaterialReactTable } from 'material-react-table';
import { Path, useFormContext } from 'react-hook-form-mui';
import { is } from '../../../common/is';
import { getProperty } from '../../Contexts/getProperty';
import { useCallback, useMemo } from 'react';
import { IconButton, List, ListItem, ListItemText, PaperProps, TableContainerProps, TableProps, Tooltip } from '@mui/material';
import { collections } from '../collections';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlusSquare, faTrashCan } from '@fortawesome/pro-solid-svg-icons';
import { useLocalRealm } from '../../../hooks/useLocalRealm';
import { $initialCollection } from '../creators/$initialCollection';
import { useInvalidator } from '../../../hooks/useInvalidator';
import { $convertToRealm } from '../creators/$convertToRealm';
import { $metas } from '../metas';
import { checkTransaction } from '../../../util/checkTransaction';
import { useDependencies } from '../../../hooks/useDependencies';
import { useReflectionContext } from '../../../hooks/useReflectionContext';
import { removeProperty } from '../../../common/object/removeProperty';
import { identity } from '../../../common/functions/identity';
import { renderCreateModal } from './renderCreateModal';


export function JITTMultiControl<TParent, TListOf, TPropertyName extends Path<TListOf> | undefined = undefined>(
    outerProps: {
        objectType: RealmObjects;
        ofObjectType: RealmPrimitives | RealmObjects;
        listType: ListTypeKind;
        ItemElement?: React.FunctionComponent<{ data: TListOf }>;
        labelPropertyName?: TPropertyName;
    },
    initialDisable = false,
    ...dependencies: IDependency[]
) {
    const MultiElement = (innerProps: Parameters<Exclude<MRT_ColumnDef<any, any>['Edit'], undefined>>[0]) => {
        console.log(`props`, outerProps);
        const { listType, objectType, ofObjectType } = outerProps;
        const { getIsEmbedded } = useReflectionContext();
        const getIsPrimitive = is.realmType.primitive;
        const ofTypeKind = getIsPrimitive(ofObjectType) ? 'primitive' : getIsEmbedded(ofObjectType) ? 'embedded' : 'reference';
        const labelPropertyName = (outerProps as { labelPropertyName?: string }).labelPropertyName;
        const ItemElement =
            (outerProps as { ItemElement?: React.FunctionComponent<{ data: TListOf }> }).ItemElement ??
            ((({ data }: { data: TListOf }) => (
                <span>{ofTypeKind === 'primitive' ? (data as string) : getProperty((outerProps as any).labelPropertyName as string)(data as AnyObject)}</span>
            )) as React.FunctionComponent<{ data: TListOf }>);
        console.log(`JITTDataStructure`, listType, objectType, ofObjectType, ItemElement, labelPropertyName);
        const { editingRow, creatingRow } = innerProps.table.getState();
        const isEditing = editingRow != null;
        const isCreating = creatingRow != null;
        const formContext = useFormContext();
        const spread = useDependencies(innerProps, initialDisable, ...dependencies);
        const value = useMemo(
            () => (isEditing ? getProperty(spread.name)(innerProps.row.original) ?? (listType === 'dictionary' ? {} : []) : formContext.watch(spread.name) ?? (listType === 'dictionary' ? {} : [])),
            [formContext, innerProps.row.original, isEditing, listType, spread.name]
        );
        console.log('MULTI-value', value);
        const db = useLocalRealm();
        const { onSuccess } = useInvalidator(objectType);
        console.log(`spread`, spread);
        const onDelete = useCallback(
            (ix: number | string) => {
                const onClick = async () => {
                    if (isCreating) {
                        const nextValue = Array.isArray(value) ? value.filter((x, i) => i !== ix) : removeProperty(value, ix as string);
                        formContext.setValue(spread.name, nextValue);
                        return;
                    }
                    switch (listType) {
                        case 'dictionary': {
                            const func = () => {
                                if (is.dbDictionary(value)) {
                                    console.log('deleting dictionary entry');
                                    value.remove(ix as string);
                                    return;
                                }
                                // setProperty(spread.name)(dict as any)(undefined);
                                value[ix as string] = undefined;
                                // const result = convert(data as any)({} as any);
                                // Object.entries(result).forEach(([k, v]) => {
                                //     dict[k] = v;
                                // });
                            };
                            return checkTransaction(db)(func);
                        }
                        case 'list':
                        case 'set': {
                            const func = () => {
                                if (is.dbSet(value)) {
                                    value.delete(value[ix as number]);
                                    return;
                                }
                                if (is.dbList(value)) {
                                    value.remove(ix as number);
                                    return;
                                }
                                (innerProps.row.original[spread.name] as any) = (value as any[]).filter((x, i) => i !== ix);
                            };
                            return checkTransaction(db)(func);
                        }
                    }
                };
                return () => onClick().then(onSuccess);
            },
            [db, formContext, innerProps.row.original, isCreating, listType, onSuccess, spread.name, value]
        );
        const onSubmit = useCallback(
            async (data: { key?: string; value: TListOf }) => {
                console.log(`onSubmit.data`, data);
                const convertTo = (ofTypeKind === 'primitive' || ofTypeKind === 'embedded' ? $convertToRealm[ofObjectType as keyof typeof $convertToRealm] : identity) as ConvertToRealmFunction<
                    TListOf & AnyObject
                >;
                const convert = (d: { key?: string; value: TListOf }) => {
                    const convertedValue = convertTo(d.value as any);
                    console.log(`convert.d`, d);
                    console.log(`convert.convertedValue`, convertedValue);
                    console.log(`convert.value`);
                    return listType === 'dictionary'
                        ? () => {
                              if (d.key == null) throw new Error('no key');
                              value[d.key] = convertedValue;
                          }
                        : listType === 'set'
                        ? is.dbSet(value)
                            ? () => value.add(convertedValue)
                            : () => ((innerProps.row.original[spread.name] as any) = [...value, convertedValue])
                        : () => {
                              (innerProps.row.original[spread.name] as any) = [...value, convertedValue];
                          };
                };
                if (isCreating) {
                    const converted = convertTo(data.value as any);
                    console.log(`isCreating.data`, data);
                    console.log(`isCreating.converted`, converted);
                    if (listType === 'dictionary') {
                        if (data.key == null) throw new Error('no key');
                        const next = { ...value, [data.key]: converted };
                        console.log(`isCreating.next`, next);
                        formContext.setValue(spread.name, next);
                        return;
                    }
                    const next = [...value, converted];
                    console.log(`isCreating.next`, next);
                    formContext.setValue(spread.name, next);
                    return;
                }
                const func = convert(data);
                checkTransaction(db)(func);
                onSuccess();
            },
            [ofTypeKind, ofObjectType, isCreating, db, onSuccess, listType, value, innerProps.row.original, spread.name, formContext]
        );
        const items = listType === 'dictionary' ? (Object.entries(value) as [string, TListOf][]) : (Array.from(value) as TListOf[]);
        const JITTListItemInsert = JITTListItemEntry<TParent, TListOf>({ submit: onSubmit, objectType, ofObjectType, listType, ofTypeKind, labelPropertyName: (labelPropertyName ?? '') as any });
        return spread.disabled ? null : (
            <fieldset name={spread.name} className={['flex flex-col w-full', spread.classes.root].join(' ')}>
                <legend>{spread.label}</legend>
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

export type JITTListItemEntryProps<TListOf> = {
    ofObjectType: RealmPrimitives | RealmObjects;
    labelPropertyName: Path<TListOf>;
    listType: ListTypeKind;
    ofTypeKind: 'primitive' | 'embedded' | 'reference';
    objectType: RealmObjects | RealmPrimitives;
    submit: (value: any) => Promise<void>;
};

export function JITTListItemEntry<TParent, TListOf>({ submit, objectType, ofObjectType, labelPropertyName, listType, ofTypeKind }: JITTListItemEntryProps<TListOf>) {
    function JITTListItemEntryInner(props: Parameters<Exclude<MRT_ColumnDef<any, any>['Edit'], undefined>>[0]) {
        const getColumns =
            ofTypeKind === 'primitive' || ofTypeKind === 'embedded'
                ? collections[ofObjectType].getColumns
                : (...pre: string[]) => [$metas.lookup([...pre].join('.'), { objectType: ofObjectType as RealmObjects, labelPropertyName: labelPropertyName as any }, false)] as DefinedMRTColumns<any>;
        const columns: DefinedMRTColumns<any> =
            listType === 'dictionary' ? ([$metas.string('key', { header: 'Key' }, false), ...getColumns('value')] as DefinedMRTColumns<any>) : (getColumns('value') as DefinedMRTColumns<any>);
        const initializer = $initialCollection[ofObjectType];
        const table = useMaterialReactTable({
            columns,
            data: [],
            renderCreateRowDialogContent: renderCreateModal(initializer, (d: any) => submit(d)),
            muiTableContainerProps: {
                classes: {
                    root: 'hidden'
                }
            } as TableContainerProps,
            muiTablePaperProps: {
                classes: {
                    root: 'hidden'
                }
            } as PaperProps,
            muiTableProps: {
                classes: {
                    root: 'hidden'
                }
            } as TableProps
        });
        console.log(`table`, table);
        console.log(`table.state`, table.getState());
        return (
            <>
                <MaterialReactTable
                    table={table}
                    // muiTablePaperProps={{
                    //     className: 'hidden',
                    //     sx: {
                    //         display: 'hidden'
                    //     }
                    // }}
                    // muiTableContainerProps={{
                    //     sx: {
                    //         display: 'hidden'
                    //     }
                    // }}
                    // muiTableProps={{
                    //     sx: {
                    //         display: 'hidden'
                    //     }
                    // }}
                />
                <Tooltip title='Insert a new record'>
                    <IconButton color='primary' type='button' onClick={() => table.setCreatingRow(true)}>
                        <FontAwesomeIcon icon={faPlusSquare} className='block object-contain w-5 h-5' />
                    </IconButton>
                </Tooltip>
            </>
        );
    }
    return JITTListItemEntryInner;
}

// export function JITTItemModal<TParent extends MRT_RowData, TListOf>({
//     EditControls,
//     onSubmit,
//     isOpen,
//     hideModal,
//     columns,
//     ...props
// }: {
//     isOpen: boolean;
//     hideModal: () => void;
//     init: () => Promise<TListOf>;
//     ofObjectType: RealmPrimitives | RealmObjects;
//     listType: ListTypeKind;
//     objectType: string;
//     // eslint-disable-next-line @typescript-eslint/ban-types
//     EditControls: React.FunctionComponent<any>;
//     columns: DefinedMRTColumns<{ key?: string; value: TListOf }>;
//     onSubmit: (value: any) => Promise<void>;
// }) {
//     const initializer: () => Promise<TListOf> = (async () => {
//         return is.realmType.primitive(props.ofObjectType) ? { value: await props.init() } : await $initialCollection[props.ofObjectType]();
//     }) as any;
//     const formContext = useForm({
//         criteriaMode: 'all' as const,
//         mode: 'onBlur' as const,
//         reValidateMode: 'onChange' as const,
//         defaultValues: initializer
//     });

//     table.setCreatingRow(createRow(formContext.getValues()));

//     const $onSubmit = useCallback(
//         (ev: React.FormEvent) => {
//             ev.preventDefault();
//             ev.stopPropagation();
//             formContext.handleSubmit((data) => {
//                 console.log('onSubmit.data', data);
//                 onSubmit(data);
//             })(ev);
//         },
//         [formContext, onSubmit, onSuccess]
//     );
//     const onBlur = useCallback(
//         (name: string) => (ev: React.FocusEvent) => {
//             console.log('onBlur', name, ev);
//         },
//         []
//     );
//     return (
//         <OnBlurContext.Provider value={onBlur}>
//             <Modal open={isOpen} onClose={hideModal}>
//                 <Box className='absolute top-1/2 left-1/2 -translate-x-1/2 w-[400px] bg-neutral-300 border-solid border-2 border-white shadow-lg pt-2 px-4 pb-3'>
//                     <FormProvider {...formContext}>
//                         <form onSubmit={$onSubmit}>
//                             {/* <DialogTitle variant='h4' className='font-bold text-white bg-slate-600 font-rubik'>
//                                 {toProperFromCamel(props.objectType)}
//                             </DialogTitle>
//                             <Divider variant='middle' className='border-yellow-700' /> */}
//                             {/* <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}></DialogContent> */}
//                             <EditControls />
//                             {/* <Divider variant='middle' className='border-yellow-700' /> */}
//                             <div className='flex justify-end w-full'>
//                                 <Tooltip title='Cancel'>
//                                     <IconButton aria-label='Cancel' onClick={hideModal}>
//                                         <FontAwesomeIcon icon={faCancel} className='block object-contain w-8 h-8' />
//                                     </IconButton>
//                                 </Tooltip>
//                                 <Tooltip title='Save'>
//                                     <IconButton aria-label='Save' color='info' type='submit'>
//                                         {formContext.formState.isSubmitting ? <CircularProgress size={18} /> : <FontAwesomeIcon icon={faFloppyDisk} className='block object-contain w-8 h-8' />}
//                                     </IconButton>
//                                 </Tooltip>
//                             </div>
//                             {/* <DialogActions>
//                                 <Tooltip title='Cancel'>
//                                     <IconButton aria-label='Cancel' onClick={hideModal}>
//                                         <FontAwesomeIcon icon={faCancel} className='block object-contain w-8 h-8' />
//                                     </IconButton>
//                                 </Tooltip>
//                                 <Tooltip title='Save'>
//                                     <IconButton aria-label='Save' color='info' type='submit'>
//                                         {formContext.formState.isSubmitting ? <CircularProgress size={18} /> : <FontAwesomeIcon icon={faFloppyDisk} className='block object-contain w-8 h-8' />}
//                                     </IconButton>
//                                 </Tooltip>
//                             </DialogActions> */}
//                         </form>
//                     </FormProvider>
//                 </Box>
//             </Modal>
//         </OnBlurContext.Provider>
//     );
// }
