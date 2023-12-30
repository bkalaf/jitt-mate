/* eslint-disable @typescript-eslint/no-explicit-any */
import { AutocompleteElement, FieldValues, Path, UseFormReturn, useFormContext } from 'react-hook-form-mui';
import { useQuery } from '@tanstack/react-query';
import { useLocalRealm } from '../../../hooks/useLocalRealm';
import { useDependencies } from '../../../hooks/useDependencies';
import { MRT_ColumnDef, MRT_RowData } from 'material-react-table';
import { createFilterOptions } from '@mui/material';
import { fromOID } from '../../../dal/fromOID';
import { handleLabelProperty } from './handleLabelProperty';
import { useJITTCollectionContext } from '../../Contexts/useJITTCollectionContext';

export function JITTLookupControl<T extends MRT_RowData, TLookup extends EntityBase>(
    {
        objectType,
        labelPropertyName,
        onChange
    }: { objectType: RealmObjects; labelPropertyName: Path<TLookup> | ((x: TLookup) => string); onChange?: (formContext: UseFormReturn<FieldValues>, db: Realm) => (ev: React.ChangeEvent, newValue: any) => void },
    initialDisable = false,
    ...dependencies: IDependency[]
) {
    return function MRT_LookupControl(props: Parameters<Exclude<MRT_ColumnDef<any, any>['Edit'], undefined>>[0]) {
        const db = useLocalRealm();
        const { data, isLoading } = useQuery({
            queryKey: [objectType, 'dropdown'],
            queryFn: () => {
                // checkTransaction(db)(() => db.objects<IRealmEntity<any>>(objectType).forEach((x) => x.update()));                
                return Promise.resolve(
                    Array.from(db.objects<TLookup>(objectType) ?? []).sort((a, b) => {
                        const valueA = handleLabelProperty(labelPropertyName)(a);
                        const valueB = handleLabelProperty(labelPropertyName)(b);
                        return valueA.localeCompare(valueB);
                    })
                    // .map((x) => ({
                    //     // entity: x,
                    //     // label: typeof labelPropertyName === 'function' ? labelPropertyName : (x: TLookup) => x[labelPropertyName as keyof TLookup] as string;, // x[labelPropertyName as keyof TLookup] as string,
                    //     label: handleLabelProperty(labelPropertyName)(x),
                    //     id: (x as any)._id.toHexString()
                    // })) ?? []
                );
            }
        });
        const { classes, disabled, onBlur, ...spread } = useDependencies(props, initialDisable, ...dependencies);
        const formContext = useFormContext();
        const { matchFromStart } = useJITTCollectionContext();
        return (
            isLoading ? <></> : <AutocompleteElement
                loading={isLoading}
                options={data ?? []}
                name={spread.name}
                label={spread.label}
                control={spread.control}                
                autocompleteProps={{
                    getOptionLabel: (option: any) => {
                        return handleLabelProperty(labelPropertyName)(option)
                    },
                    isOptionEqualToValue: (option: T, value: T) => {
                        return fromOID(option._id) === fromOID(value._id)
                    },
                    filterOptions: createFilterOptions({
                        ignoreCase: true,
                        ignoreAccents: true,
                        limit: 150,
                        trim: true,
                        matchFrom: matchFromStart ? 'start' : 'any'
                    }),
                    onChange: (ev, newValue) => {
                        onBlur({ ...ev, target: { value: newValue } } as any);
                        if (onChange) {
                            onChange(formContext, db)(ev as any, newValue);
                        }
                    },
                    disabled,
                    classes
                }}
            />
        );
    };
}
