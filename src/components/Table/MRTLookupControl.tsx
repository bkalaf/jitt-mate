/* eslint-disable @typescript-eslint/no-explicit-any */
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Icon, createFilterOptions } from '@mui/material';
import { AutocompleteElement, SelectElement, useFormContext } from 'react-hook-form-mui';
import { faSpinner } from '@fortawesome/pro-duotone-svg-icons';
import { useQuery } from '@tanstack/react-query';
import { useLocalRealm } from '../../routes/loaders/useLocalRealm';
import { fromOID } from '../../dal/fromOID';
import { toOID } from '../../dal/toOID';

export function MRTEnumControl<T extends AnyObject>(name: string, header: string, enumMap: EnumMap) {
    return function MRT_EnumControl() {
        const options = Object.entries(enumMap)
            .map(([id, label]) => ({ id, label }))
            .sort((a, b) => a.label.localeCompare(b.label));
        return <SelectElement name={name} label={header} options={options} type='string' />;
    };
}

export function MRTLookupControl<T extends AnyObject>(objectType: string, name: string, label: string, itemValue: string) {
    return function MRT_LookupControl() {
        const db = useLocalRealm();
        const { data, isLoading } = useQuery({
            queryKey: [objectType, 'dropdown'],
            queryFn: () => {
                return Promise.resolve(
                    (
                        db.objects<T>(objectType).map((x) => ({
                            entity: x,
                            label: x[itemValue] as string,
                            value: (x as any)._id.toHexString()
                        })) ?? []
                    ).sort((a, b) => a.label.localeCompare(b.label))
                );
            }
        });
        const context = useFormContext();
        return (
            <AutocompleteElement
                name={name}
                label={label}
                loading={isLoading}
                options={data ?? []}
                autocompleteProps={{
                    getOptionLabel: (option: T) => option[itemValue] ?? '',
                    isOptionEqualToValue: (option: T, value: OID) => {
                        console.error('isOptionalEqualToValue', option, value);
                        return option.value === toOID((value as any)._id)?.toHexString();
                    }
                }}
                control={context.control}
            />
        );
    };
}
