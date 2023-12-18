/* eslint-disable @typescript-eslint/no-explicit-any */
import { AutocompleteElement, FormProvider, Path, UseFormReturn, useForm, useFormContext } from 'react-hook-form-mui';
import { useMutation, useQuery } from '@tanstack/react-query';
import { useLocalRealm } from '../../../routes/loaders/useLocalRealm';
import { useDependencies } from '../../../hooks/useDependencies';
import { MRT_ColumnDef, MRT_Row, MRT_RowData } from 'material-react-table';
import { getProperty } from '../../Contexts/getProperty';
import { IMaterialComposition } from '../../../dal/types';
import { useCallback } from 'react';
import { updateRecordProp } from '../../../hooks/updateRecord';
import { useCollectionRoute } from '../../../hooks/useCollectionRoute';
import { useInvalidator } from '../../../hooks/useInvalidator';
import { is } from '../../../dal/is';
import { checkTransaction } from '../../../util/checkTransaction';
import { JITTIconButton } from '../clothingCareMeta';
import { faCancel, faFloppyDisk, faPlusSquare, faTrashCan } from '@fortawesome/pro-solid-svg-icons';
import { Dialog, DialogActions, DialogContent, List, ListItem, ListItemText } from '@mui/material';
import { toNotNullOID } from '../../../dal/toOID';
import { useToggler } from '../../../hooks/useToggler';
import { $metas } from '../metas';
import { collections } from '../collections';
import { $initialCollection } from '../creators/$initialCollection';
import { removeProperty } from './removeProperty';

// creatingRow: MRT_Row<T> | null, setCreatingRow: MRT_TableInstance<T>['setCreatingRow']
export function updateDictionary<T extends MRT_RowData, TValue>(db: Realm, collection: RealmObjects, propertyName: string, formContext: UseFormReturn, creatingRow: MRT_Row<T> | null) {
    return function ({ _id, key, value }: { _id: OID; key: string; value: TValue | undefined }) {
        if (creatingRow) {
            if (typeof creatingRow === 'boolean') return Promise.reject(new Error('creating row is a boolean'));
            const dictionary = formContext.watch(propertyName);
            formContext.setValue(propertyName, { ...(dictionary ?? {}), [key]: value });
            // const { _valuesCache } = creatingRow;
            // const dictionary = (_valuesCache[propertyName] as Record<string, TValue> | undefined) ??  {};
            // setCreatingRow({ ...creatingRow, _valuesCache: { ..._valuesCache, [propertyName]: { ...dictionary, [key]: value }}});
            return Promise.resolve();
        }
        const obj = db.objectForPrimaryKey<T>(collection, toNotNullOID(_id) as T[keyof T]);
        if (obj == null) {
            return Promise.reject(new Error(`cannot find obj ${_id.toString()}`));
        }
        const dictionary = (obj[propertyName] as DBDictionary<TValue> | Record<string, TValue> | undefined) ?? {};
        if (is.dbDictionary(dictionary)) {
            checkTransaction(db)(() => (value == null ? dictionary.remove(key) : (dictionary[key] = value)));
            return Promise.resolve();
        }
        checkTransaction(db)(() => (value == null ? delete (dictionary ?? {})[key] : { ...(dictionary ?? {}), [key]: value }));
        return Promise.resolve();
    };
}
export function JITTMaterialsControl<T extends MRT_RowData>(initialDisable = false, ...dependencies: IDependency[]) {
    function InnerJITTMaterialsControl(props: Parameters<Exclude<MRT_ColumnDef<T, DBDictionary<IMaterialComposition> | Record<string, IMaterialComposition>>['Edit'], undefined>>[0]) {
        const dictionary = Object.entries(props.cell.getValue() ?? {});
        const collection = useCollectionRoute();
        const db = useLocalRealm();
        const onSuccess = useInvalidator(collection);
        const { name, disabled, label } = useDependencies(props, initialDisable, ...dependencies);
        const { mutateAsync } = useMutation({
            mutationFn: updateRecordProp(collection, db),
            ...onSuccess
        });
        const onDelete = useCallback(
            (index: string) => {
                return () => {
                    const func = () => {
                        const oldValue = props.cell.getValue();
                        const newValue = is.dbDictionary(oldValue) ? oldValue.remove(index) : removeProperty(oldValue, index);
                        mutateAsync({
                            propertyName: name,
                            _id: props.row.original._id,
                            value: newValue
                        });
                    };
                    checkTransaction(db)(func);
                };
            },
            [db, mutateAsync, name, props.cell, props.row.original._id]
        );
        const { creatingRow } = props.table.getState();
        const formContext = useFormContext();
        const { mutateAsync: insertAsync } = useMutation({
            mutationFn: updateDictionary(db, collection, name, formContext, creatingRow),
            ...onSuccess
        });
        const [isOpen, toggleOpen, , hideModal] = useToggler(false);
        const Dialog = JITTMaterialDialog({ isOpen, hideModal, onInsert: insertAsync, _id: props.row.id });
        return (
            <fieldset>
                <legend className='flex flex-row'>
                    <span className='inline-flex'>{label}</span>
                    <JITTIconButton color='primary' Icon={faPlusSquare} title='Insert' onClick={toggleOpen} className='w-5 h-5' />
                </legend>
                <Dialog {...(props as any)} />
                <List disablePadding>
                    {dictionary.map(([k, v], ix) => (
                        <ListItem
                            key={ix}
                            disableGutters
                            disablePadding
                            secondaryAction={<JITTIconButton color='error' Icon={faTrashCan} title='Delete this row' onClick={onDelete(k)} className='w-5 h-5' />}>
                            <ListItemText primary={k} secondary={v.toOutput} />
                        </ListItem>
                    ))}
                </List>
            </fieldset>
        );
    }
    return InnerJITTMaterialsControl;
}
export function JITTMaterialDialog<TParent>({
    isOpen,
    hideModal,
    onInsert,
    _id
}: {
    isOpen: boolean;
    hideModal: () => void;
    _id: OID;
    onInsert: (values: { _id: OID; key: string; value: IMaterialComposition }) => Promise<void>;
}) {
    function InnerMaterialsDialog(props: Parameters<Exclude<MRT_ColumnDef<any, any>['Edit'], undefined>>[0]) {
        const columns = [$metas.string('key', { header: 'Key' }, false), ...collections['materialComposition'].getColumns('value')] as DefinedMRTColumns<{ key: string; value: TParent & MRT_RowData }>;
        const EditControls = useEditControls(columns);
        const formContext = useForm({
            defaultValues: () =>
                $initialCollection['materialComposition']().then((value) => ({
                    key: '',
                    value: value as IMaterialComposition
                }))
        });
        const onClick = useCallback(
            (ev: React.MouseEvent) => {
                formContext.handleSubmit(({ key, value }) => {
                    onInsert({ _id, key, value }).then(hideModal);
                })(ev);
            },
            [formContext]
        );
        return (
            <FormProvider {...formContext}>
                <Dialog open={isOpen} onClose={hideModal} maxWidth='md' fullWidth>
                    <DialogContent>
                        <EditControls {...(props as any)} />
                    </DialogContent>
                    <DialogActions className='flex justify-end w-full'>
                        <JITTIconButton type='button' color='warning' title='Cancel' Icon={faCancel} className='w-5 h-5' onClick={hideModal} />
                        <JITTIconButton type='button' color='primary' title='Submit' Icon={faFloppyDisk} onClick={onClick} className='w-5 h-5' />
                    </DialogActions>
                </Dialog>
            </FormProvider>
        );
    }
    return InnerMaterialsDialog;
}
export function JITTLookupControl<T extends MRT_RowData, TLookup extends EntityBase>(
    {
        objectType,
        labelPropertyName,
        onChange
    }: { objectType: RealmObjects; labelPropertyName: Path<TLookup>; onChange?: (formContext: UseFormReturn<FieldValues>, db: Realm) => (ev: React.ChangeEvent, newValue: any) => void },
    initialDisable = false,
    ...dependencies: IDependency[]
) {
    return function MRT_LookupControl(props: Parameters<Exclude<MRT_ColumnDef<any, any>['Edit'], undefined>>[0]) {
        console.log('lookupprops', props);
        const db = useLocalRealm();
        const { data, isLoading } = useQuery({
            queryKey: [objectType, 'dropdown'],
            queryFn: () => {
                return Promise.resolve(
                    Array.from(db.objects<TLookup>(objectType) ?? []).sort((a, b) => {
                        return a[labelPropertyName as keyof TLookup] < b[labelPropertyName as keyof TLookup]
                            ? -1
                            : a[labelPropertyName as keyof TLookup] > b[labelPropertyName as keyof TLookup]
                            ? 1
                            : 0;
                    })
                    // .map((x) => ({
                    //     entity: x,
                    //     label: x[itemValue] as string,
                    //     value: (x as any)._id.toHexString()
                    // })) ?? []
                );
            }
        });
        const { classes, disabled, onBlur, ...spread } = useDependencies(props, initialDisable, ...dependencies);
        const formContext = useFormContext();
        return (
            <AutocompleteElement
                loading={isLoading}
                options={data ?? []}
                name={spread.name}
                label={spread.label}
                control={spread.control}
                autocompleteProps={{
                    getOptionLabel: (option: T) => getProperty(labelPropertyName)(option) ?? '',
                    isOptionEqualToValue: (option: T, value: T) => {
                        return option._id.toHexString() === value._id.toHexString();
                    },
                    onChange: (ev, newValue) => {
                        onBlur({ ...ev, target: { value: newValue } } as any);
                        if (onChange) {
                            onChange(formContext, db)(ev, newValue);
                        }
                    },
                    disabled,
                    classes
                }}
            />
        );
    };
}
