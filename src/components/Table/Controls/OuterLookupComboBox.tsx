import { IRealmEntity } from '../../../dal/types';
import { Autocomplete, AutocompleteProps, CircularProgress, TextField, createFilterOptions } from '@mui/material';
import { forwardRef, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { toProperFromCamel } from '../../../common/text/toProperCase';
import { IComboBoxProps, renderGroup } from '../../../dto/collections/ProductTaxonomy';
import { useQuery } from '@tanstack/react-query';
import { useLocalRealm } from '../../../routes/loaders/useLocalRealm';
import { fromOID } from '../../../dal/fromOID';
import { useEditingOrCreatingRow } from '../../../hooks/useEditingOrCreatingRow';
import { getProperty } from '../../Contexts/getProperty';
import { MRT_ColumnDef, MRT_EditCellTextField } from 'material-react-table';
MRT_EditCellTextField
export type ComboBoxEntity<T extends IRealmEntity<T>> = {
    label: string;
    value: string;
    entity?: T;
};

export function lookupFilterOptions(filterOpt: ReturnType<typeof createFilterOptions<ComboBoxEntity<any>>>) {
    return function (...params: Parameters<Exclude<AutocompleteProps<ComboBoxEntity<any>, false, true, true>['filterOptions'], undefined>>) {
        const [options, state] = params;
        console.log(params);
        console.log(`options`, options);
        console.log(`state`, state);
        const { inputValue, getOptionLabel } = state;
        const isExisting = options.some((option) => inputValue === (typeof option === 'string' ? option : getOptionLabel(option)));
        const filters = filterOpt(options, state);
        if (inputValue !== '' && !isExisting) {
            filters.push({
                value: inputValue,
                label: `Add "${inputValue}"`
            });
        }
        return filters;
    };
}

export const lookupFilter = createFilterOptions<ComboBoxEntity<any>>({
    ignoreCase: true,
    ignoreAccents: true,
    matchFrom: 'start',
    trim: true,
    limit: 10,
    stringify: (option) => (typeof option === 'string' ? option : option.label)
});

export function OuterLookupComboBox(outerProps: { objectType: RealmObjects; name: string; label?: string }) {
    function LookupComboBox<T extends IRealmEntity<T>>(props: Parameters<Exclude<MRT_ColumnDef<T>['Edit'], undefined>>[0]) {
        const { objectType, name, label } = outerProps;
        const db = useLocalRealm();
        const { data, isLoading } = useQuery({
            queryKey: [objectType, 'dropdown'],
            queryFn: () => {
                return Promise.resolve(
                    db.objects<T>(objectType).map((x) => {
                        return {
                            label: getProperty(label ?? '')(x),
                            value: fromOID(x._id),
                            entity: x
                        } as ComboBoxEntity<T>;
                    })
                );
            }
        });
        const setEditCreateRow = useEditingOrCreatingRow(props.table, props.row);
        const [inputValue, setInputValue] = useState<ComboBoxEntity<any> | undefined>(undefined);
        const onChange = useCallback(
            (...params: Parameters<Exclude<AutocompleteProps<ComboBoxEntity<any>, false, false, false>['onChange'], undefined>>) => {
                console.log('ONCHANGE', ...params);
                const [event, value, reason, details] = params;
                if (typeof value === 'string') {
                    setInputValue({ value, label: toProperFromCamel(value), entity: undefined });
                } else if (value && (value as any).inputValue) {
                    setInputValue({ value: (value as any).inputValue, label: toProperFromCamel((value as any).inputValue), entity: undefined });
                } else {
                    setInputValue(value ?? undefined);
                    props.row._valuesCache[name as keyof typeof props.row._valuesCache] = value?.entity ?? undefined;
                    setEditCreateRow(props.row);
                }
            },
            [name, props, setEditCreateRow]
        );
        const $filterOptions = useMemo(() => lookupFilterOptions(lookupFilter), []);
        const header = props.column.columnDef.header;
        useEffect(() => {
            const r = props.table.getState().editingRow ?? props.table.getState().creatingRow;
            console.log('useEffect', r, outerProps, props);
            const current = r?._valuesCache[outerProps.name];
            setInputValue((prev) => {
                const next = { entity: current, label: current[outerProps.label ?? ''], value: r?.id ?? '' };
                return prev?.label === next.label ? prev : next;
            });
            const thisRef = props.table.refs.editInputRefs.current[outerProps.name];
            console.error(`thisRef`, thisRef);
        }, [props]);
        console.error(`refs`, props.table.refs);
        
        return (
            <Autocomplete<ComboBoxEntity<any>, false, false, false>
                selectOnFocus
                clearOnBlur
                handleHomeEndKeys
                onChange={onChange}
                value={inputValue}
                filterSelectedOptions
                className='font-rubik'
                options={data ?? []}
                loading={isLoading}
                filterOptions={$filterOptions}
                getOptionLabel={(option) => option.label}
                isOptionEqualToValue={(option, value) => option.value === value.value}
                loadingText='LOADING DATA...'
                renderGroup={renderGroup}
                renderInput={(params) => (
                    <TextField
                        {...params}
                        label={header}
                        inputRef={(inputRef) => {
                            if (inputRef) {
                                props.table.refs.editInputRefs.current[props.column.id] = inputRef;
                                console.error('ref set', inputRef);
                            }
                        }}
                        InputProps={{
                            ...params.InputProps,
                            name,
                            endAdornment: (
                                <>
                                    {isLoading ? <CircularProgress color='inherit' size={20} /> : null}
                                    {params.InputProps.endAdornment}
                                </>
                            )
                        }}
                    />
                )}
            />
        );
    }
    return forwardRef(LookupComboBox);
}
