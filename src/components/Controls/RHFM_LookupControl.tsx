/* eslint-disable @typescript-eslint/no-explicit-any */
import { AutocompleteElement, useFormContext } from 'react-hook-form-mui';
import { useQuery } from '@tanstack/react-query';
import { useLocalRealm } from '../../routes/loaders/useLocalRealm';
import { toOID } from '../../dal/toOID';
import { useOnBlurContext } from '../Table/creators/useOnBlurContext';
import { IDependency } from '../Table/Controls/RHFM_Depends';
import { useDependencies } from './useDependencies';

export function RHFM_LookupControl<T extends AnyObject>(objectType: string, name: string, label: string, itemValue: string, ...dependencies: IDependency[]) {
    return function MRT_LookupControl(props: any) {
        console.log('lookupprops', props);
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
        const { control, classes } = useDependencies(...dependencies)
        const onBlur = useOnBlurContext();
        return (
            <AutocompleteElement
                classes={classes}
                control={control}
                name={name}
                label={label}
                loading={isLoading}
                options={data ?? []}
                autocompleteProps={{
                    getOptionLabel: (option: T) => option[itemValue] ?? '',
                    isOptionEqualToValue: (option: T, value: T) => {
                        return option._id.toHexString() === value._id.toHexString();
                    },
                    onChange: (ev, newValue) => onBlur(name)({ ...ev, target: { value: newValue }} as any),
                    classes: classes
                }}
                {...props}
            />
        );
    };
}
