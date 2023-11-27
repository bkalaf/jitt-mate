import { AutocompleteElement, useController, useFormContext } from 'react-hook-form-mui';
import { useQuery } from '@tanstack/react-query';
import { useLocalRealm } from '../../routes/loaders/useLocalRealm';
import { fromOID } from '../../dal/fromOID';
import { Autocomplete, AutocompleteProps, Chip, CircularProgress, FilterOptionsState, createFilterOptions } from '@mui/material';
import { MRT_ColumnDef } from 'material-react-table';
import { ForwardedRef, useCallback, useEffect, useState } from 'react';
import { checkTransaction } from '../../util/checkTransaction';
import { useInvalidator } from '../../hooks/useInvalidator';
import { DebouncedTextFieldElement } from './Controls/DebouncedInput';

// export function MRTDbSetContainer<T extends AnyObject>(objectType: string, name: string, label: string, labelPropertyName: string, valuePropertyName = '_id') {
//     return function (props: Parameters<NonNullable<MRT_ColumnDef<any, DBSet<T>>['Edit']>>[0]) {};
// }

// export function MRTDBSetMultiSelectControl<T extends AnyObject, TParent extends EntityBase>(objectType: string, name: string, header: string, labelPropertyName: string, valuePropertyName = '_id') {
//     const db = useLocalRealm();
//     const { data, isLoading } = useQuery({
//         queryKey: [objectType],
//         queryFn: () => Promise.resolve(Array.from(db.objects<T>(objectType).sorted([[labelPropertyName, false] as SortDescriptor])))
//     });
//     // const options = useMemo(() => data.map(x => ), [])
//     const { control } = useFormContext();
//     const { field, fieldState } = useController({
//         name,
//         control
//     });
//     field.value;
//     const [value] = useWatch({
//         name: name
//     });
//     return isLoading ? (
//         <Typography>Loading Data</Typography>
//     ) : (
//         <MultiSelectElement
//             name={name}
//             options={data ?? []}
//             label={header}
//             itemKey={valuePropertyName}
//             itemValue={valuePropertyName}
//             itemLabel={labelPropertyName}
//             showChips
//             preserveOrder
//             variant='filled'
//             size='small'
//             control={control}
//         />
//     );
// }
export function MRTDbSetAutoCompleteControl<T extends AnyObject, TParent extends EntityBase>(
    objectType: string,
    objectType2: string,
    name: string,
    header: string,
    labelPropertyName: string,
    valuePropertyName = '_id'
) {
    return function MRT_DbSetControl(props: Parameters<NonNullable<MRT_ColumnDef<Entity<TParent>, Optional<DBSet<T>>>['Edit']>>[0], ref: ForwardedRef<HTMLDivElement>) {
        if (objectType2 == null) throw new Error(`objectType mismatch ${objectType} vs ${objectType2}`);
        const db = useLocalRealm();
        const getOptionLabel = (x: T | string) => (typeof x === 'string' ? x : x[labelPropertyName]);
        const { data, isLoading } = useQuery({
            queryKey: [objectType],
            queryFn: () => {
                return Promise.resolve(Array.from((db.objects<T>(objectType) ?? []).sorted([labelPropertyName])));
            }
        });
        // const filter = createFilterOptions<T>({
        //     ignoreCase: true,
        //     ignoreAccents: true,
        //     matchFrom: 'start',
        //     trim: true
        // });
        const context = useFormContext();
        const { field, fieldState } = useController({ name, control: context.control });
        const [current, setCurrent] = useState(props.cell.getValue() as DBSet<T>);
        const invalidate = useInvalidator(objectType2);
        const setValue = useCallback(
            (func: (params: Parameters<Exclude<AutocompleteProps<T, true, true, true, typeof Chip>['onChange'], undefined>>, prev: DBSet<T>) => () => void) =>
                (params: Parameters<Exclude<AutocompleteProps<T, true, true, true, typeof Chip>['onChange'], undefined>>) => {
                    // eslint-disable-next-line @typescript-eslint/no-unused-vars
                    const [event, newValue, reason, details] = params;
                    setCurrent((prev) => {
                        console.log(`ONCHANGE(selectOption)`, `newValue`, newValue, `prev`, prev);
                        checkTransaction(db)(func(params, prev));
                        invalidate.onSuccess();
                        context.setValue(name, prev);
                        return prev;
                    });
                },
            [context, db, invalidate]
        );
        useEffect(() => {
            console.log(`setting`, name, current);
            context.setValue(name, current);
        }, [context, current]);
        const onChange = useCallback(
            (...params: Parameters<Exclude<AutocompleteProps<T, true, true, true, typeof Chip>['onChange'], undefined>>) => {
                // eslint-disable-next-line @typescript-eslint/no-unused-vars
                const [_0, newValue, reason, _3] = params;
                switch (reason) {
                    case 'selectOption': {
                        const func = (p: Parameters<Exclude<AutocompleteProps<T, true, true, true, typeof Chip>['onChange'], undefined>>, prev: DBSet<T>) => () => {
                            if (p[3] != null) {
                                prev.add(p[3].option);
                            }
                        };
                        return setValue(func)(params);
                    }
                    case 'removeOption': {
                        const func = (p: Parameters<Exclude<AutocompleteProps<T, true, true, true, typeof Chip>['onChange'], undefined>>, prev: DBSet<T>) => () => {
                            if (p[3] != null) {
                                prev.delete(p[3].option);
                            }
                        };
                        return setValue(func)(params);
                    }
                    case 'clear': {
                        const func = (p: Parameters<Exclude<AutocompleteProps<T, true, true, true, typeof Chip>['onChange'], undefined>>, prev: DBSet<T>) => () => {
                            prev.clear();
                        };
                        return setValue(func)(params);
                    }

                    case 'blur':
                        return;
                    case 'createOption':
                        throw new Error('cannot create');
                }
            },
            [setValue]
        );
        const [inputValue, setInputValue] = useState('');
        const isOptionEqualToValue = useCallback((option: T, value: any) => {
            return fromOID(option[valuePropertyName]) === fromOID(value[valuePropertyName]);
        }, []);
        const filterOptions = useCallback((options: T[], state: FilterOptionsState<T>) => {
            const filters = createFilterOptions<T>({
                ignoreAccents: true,
                ignoreCase: true,
                trim: true,
                matchFrom: 'start'
            });
            const filtered = filters(options, state);
            return filtered;
        }, []);
        return (
            <Autocomplete<T, true, true, true, typeof Chip>
                loading={isLoading}
                isOptionEqualToValue={isOptionEqualToValue}
                getOptionLabel={getOptionLabel}
                filterOptions={filterOptions}
                // name={name}
                // label={header}
                options={data ?? []}
                value={Array.from(field.value?.values() ?? [])}
                multiple
                disableCloseOnSelect
                clearOnEscape
                handleHomeEndKeys
                size='small'
                onChange={onChange}
                inputValue={inputValue}
                ref={ref}
                renderInput={(params) => (
                    <DebouncedTextFieldElement
                        debounce={300}
                        value={''}
                        onChange={(value) => setInputValue(typeof value === 'string' ? value : typeof value === 'number' ? value.toFixed(0) : value.target.value)}
                        name={name}
                        label={header}
                        {...params}
                        error={!!fieldState.error}
                        InputLabelProps={{
                            ...params.InputLabelProps
                        }}
                        InputProps={{
                            ...params.InputProps,
                            endAdornment: (
                                <>
                                    {isLoading ? <CircularProgress color='inherit' size={20} /> : null}
                                    {params.InputProps.endAdornment}
                                </>
                            )
                        }}
                        inputProps={{
                            ...params.inputProps
                        }}
                        helperText={fieldState.error?.message}
                        inputRef={field.ref}
                    />
                )}
            />
        );
    };
}
