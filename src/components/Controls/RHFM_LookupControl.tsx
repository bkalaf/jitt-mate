/* eslint-disable @typescript-eslint/no-explicit-any */
import { AutocompleteElement, useFormContext } from 'react-hook-form-mui';
import { useQuery } from '@tanstack/react-query';
import { useLocalRealm } from '../../routes/loaders/useLocalRealm';
import { toOID } from '../../dal/toOID';
import { useOnBlurContext } from '../Table/creators/useOnBlurContext';

export function RHFM_LookupControl<T extends AnyObject>(objectType: string, name: string, label: string, itemValue: string) {
    return function MRT_LookupControl() {
        const db = useLocalRealm();
        const { data, isLoading } = useQuery({
            queryKey: [objectType, 'dropdown'],
            queryFn: () => {
                return Promise.resolve(
                    Array.from(db.objects<T>(objectType).sorted([itemValue]))
                    // .map((x) => ({
                    //     entity: x,
                    //     label: x[itemValue] as string,
                    //     value: (x as any)._id.toHexString()
                    // })) ?? []
                );
            }
        });
        const context = useFormContext();
        const onBlur = useOnBlurContext();
        return (
            <AutocompleteElement
                control={context.control}
                name={name}
                label={label}
                loading={isLoading}
                options={data ?? []}
                autocompleteProps={{
                    getOptionLabel: (option: T) => option[itemValue] ?? '',
                    isOptionEqualToValue: (option: T, value: OID) => {
                        return option.value === toOID((value as any)._id)?.toHexString();
                    },
                    onBlur: onBlur(name)
                }}
            />
        );
    };
}
