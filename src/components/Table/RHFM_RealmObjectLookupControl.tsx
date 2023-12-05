import { CircularProgress, FilterOptionsState, createFilterOptions } from '@mui/material';
import { AutocompleteElement, useFormContext } from 'react-hook-form-mui';
import { toProperFromCamel } from '../../common/text/toProperCase';
import { useCallback, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useLocalRealm } from '../../routes/loaders/useLocalRealm';
import { fromOID } from '../../dal/fromOID';

export type RealmObjectLookupControlProps<T extends EntityBase> = {
    name: string;
    objectType: RealmObjects | RealmPrimitives;
    labelPropertyName: keyof T & string;
    ItemElement: React.FunctionComponent<{ data: T }>;
    header?: string;
    required?: boolean;
};

export function RHFM_RealmObjectLookupControl<T extends EntityBase>({ objectType, labelPropertyName, ItemElement, header, name, required }: RealmObjectLookupControlProps<T>) {
    const db = useLocalRealm();
    const { data, isLoading } = useQuery({
        queryKey: [objectType],
        queryFn: () => Promise.resolve(Array.from(db.objects<T>(objectType).sorted([labelPropertyName])))
    });
    const getOptionLabel = useCallback((option: T) => (option[labelPropertyName] as object).toString(), [labelPropertyName]);
    const isOptionEqualToValue = useCallback((option: T, value: T) => {
        return value == null || option == null ? false : fromOID(option._id) === fromOID(value._id);
    }, []);
    const filterOptions = useCallback(
        ($options: T[], state: FilterOptionsState<T>) => {
            const filters = createFilterOptions<T>({
                limit: 40,
                ignoreAccents: true,
                ignoreCase: true,
                matchFrom: 'start',
                stringify: (option: T) => (option[labelPropertyName] as any).toString(),
                trim: true
            });
            return filters($options, state);
        },
        [labelPropertyName]
    );
    const renderOption = useCallback((props: any, value: T) => <ItemElement {...props} data={value} />, [ItemElement]);
    const context = useFormContext();
    const onChange = useCallback(
        (event: React.BaseSyntheticEvent<any>, newValue: any) => {
            context.setValue(name, newValue);
        },
        [context, name]
    );
    const fieldState = useMemo(() => context.getFieldState(name), [context, name]);
    const color = useCallback(() => (fieldState.invalid ? ('error' as const) : fieldState.isDirty ? ('secondary' as const) : ('primary' as const)), [fieldState.invalid, fieldState.isDirty]);
    return (
        <AutocompleteElement
            name={name}
            options={data ?? []}
            loading={isLoading}
            loadingIndicator={<CircularProgress color='warning' />}
            label={header ?? toProperFromCamel(name)}
            required={required ?? false}
            autocompleteProps={{
                getOptionLabel: getOptionLabel,
                isOptionEqualToValue: isOptionEqualToValue,
                filterOptions: filterOptions,
                // renderOption: renderOption,
                onChange: onChange,
                className: 'text-base font-normal font-rubik flex w-full',
                size: 'small'
            }}
            textFieldProps={{
                className: 'text-base font-normal font-rubik flex',
                error: fieldState.error != null,
                helperText: fieldState.error?.message,
                color: color(),
                margin: 'none'
            }}
        />
    );
}
