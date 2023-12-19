/* eslint-disable @typescript-eslint/no-explicit-any */
import { AutocompleteElement, FieldValues, Path, UseFormReturn, useFormContext } from 'react-hook-form-mui';
import { useQuery } from '@tanstack/react-query';
import { useLocalRealm } from '../../../hooks/useLocalRealm';
import { useDependencies } from '../../../hooks/useDependencies';
import { MRT_ColumnDef, MRT_RowData } from 'material-react-table';
import { getProperty } from '../../Contexts/getProperty';
import { createFilterOptions } from '@mui/material';

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
                    filterOptions: createFilterOptions({
                        ignoreCase: true,
                        ignoreAccents: true,
                        limit: 50,
                        trim: true,
                        matchFrom: 'any'
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
