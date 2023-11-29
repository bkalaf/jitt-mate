import { faSquarePlus, faTrashCan } from '@fortawesome/pro-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { IconButton } from '@mui/material';
import { MRT_ColumnDef } from 'material-react-table';
import { useToggler } from '../../hooks/useToggler';
import { InsertItemModal } from './InsertItemModal';
import { ConvertToRealmFunction, convertToRealm, initialCollection } from './creators/createRenderCreateRowDialogContent';
import { collections } from './collections';
import { useCallback, useMemo, useState } from 'react';
import { AutocompleteElement, SelectElement, useController, useFormContext } from 'react-hook-form-mui';
import { useLocalRealm } from '../../routes/loaders/useLocalRealm';
import { toNotNullOID, toOID } from '../../dal/toOID';
import { useQuery } from '@tanstack/react-query';

export function SingleSelectElement<T extends EntityBase>(name: string, objectType: string, header: string, labelProperty: string) {
    function SingleSelectInnerElement() {
        const db = useLocalRealm();
        const { data: options, isLoading } = useQuery({
            queryKey: [objectType],
            queryFn: () => {
                return Promise.resolve(
                    Array.from(db.objects<T>(objectType).sorted([labelProperty]))
                    // .map((obj) => ({
                    //     label: obj[labelProperty],
                    //     value: toNotNullOID(obj._id as any as OID).toHexString()
                    // }))
                );
            }
        });
        const context = useFormContext();
        const { field } = useController<T>({
            name: 'value' as any,
            control: context.control as any
        });
        return (
            <AutocompleteElement
                options={options ?? []}
                loading={isLoading}
                name={field.name}
                label={header}
                textFieldProps={{
                    inputRef: field.ref                    
                }}
                autocompleteProps={{
                    getOptionLabel: (option: T) => option[labelProperty as keyof T] as string,
                    isOptionEqualToValue: (option: T, value: T) => {
                        return toOID(option._id)?.toHexString() === toOID(value._id)?.toHexString();
                    },
                    value: field.value,
                    onChange: (ev, newValue) => {
                        console.error(`newValue`, newValue);
                        alert(JSON.stringify(newValue));
                        field.onChange(ev);
                    },
                    onBlur: field.onBlur
                }}
            />
        );
    }
    return SingleSelectInnerElement;
}
export function MRTMultipleControl<T>(
    name: string,
    header: string,
    objectType: string,
    labelProperty: string,
    ItemElement: React.FunctionComponent<{ data: T }>,
    appendItem: (prev: T[]) => (x: T) => void,
    isLinkedAdd = false
) {
    function MRTInnerMultiControl(props: Parameters<NonNullable<MRT_ColumnDef<any, DBList<T>>['Edit']>>[0]) {
        const [open, toggleOpen] = useToggler(false);
        // const initializer = initialCollection[objectType] as any;
        const EditComponent = isLinkedAdd
            ? SingleSelectElement('value', objectType, header, labelProperty)
            : () => (
                  <>
                      {(
                          collections[objectType]
                              .getColumns()
                              .map((X) => {
                                  if ((X.enableEditing ?? true) && X.Edit == null) throw new Error('no Edit');
                                  return X.enableEditing ?? true ? X.Edit : null;
                              })
                              .filter((x) => x != null) as React.FunctionComponent[]
                      ).map((El: NonNullable<MRT_ColumnDef<any, DBList<T>>['Edit']>, ix) => (
                          <El key={ix} {...(props as any)} />
                      ))}
                  </>
              );
        const context = useFormContext();
        const { field } = useController({
            name,
            control: context.control
        });
        const deleteIndex = useCallback(
            (index: number) => {
                return () => {
                    context.setValue(
                        name,
                        ((field.value as T[]) ?? []).filter((x, i) => i !== index)
                    );
                };
            },
            [context, field.value]
        );
        return (
            <div className='flex flex-col w-full'>
                <div className='flex w-full text-center'>
                    <span className='flex justify-center w-full'>{header}</span>
                    <IconButton onClick={toggleOpen}>
                        <FontAwesomeIcon icon={faSquarePlus} className='block object-contain w-6 h-6' />
                    </IconButton>
                </div>
                <InsertItemModal
                    init={() => Promise.resolve({ value: '' })}
                    EditControls={EditComponent}
                    open={open}
                    toggleOpen={toggleOpen}
                    list={field.value}
                    setList={(next) => context.setValue(name, next)}
                />
                <ul className='border-2 border-black border-dashed'>
                    {(field.value ?? ([] as T[])).map((item: T, ix: number) => (
                        <li key={ix} className='flex justify-between w-full list-disc'>
                            <span className='flex flex-grow'>
                                <ItemElement data={item} />
                            </span>
                            <IconButton className='flex' onClick={deleteIndex(ix)}>
                                <FontAwesomeIcon icon={faTrashCan} className='block object-contain w-6 h-6' />
                            </IconButton>
                        </li>
                    ))}
                </ul>
            </div>
        );
    }
    return MRTInnerMultiControl;
}
