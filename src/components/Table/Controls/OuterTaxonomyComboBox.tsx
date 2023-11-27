import { IProductTaxonomy } from '../../../dal/types';
import { Autocomplete, AutocompleteProps, CircularProgress, TextField, createFilterOptions } from '@mui/material';
import { useCallback, useMemo, useState } from 'react';
import { MRT_ColumnDef } from 'material-react-table';
import { toProperFromCamel } from '../../../common/text/toProperCase';
import { useEditingOrCreatingRow } from '../../../hooks/useEditingOrCreatingRow';
import { $cn } from '../../../util/$cn';

export function taxonomyFilterOptions(filterOpt: ReturnType<typeof createFilterOptions<ComboBoxOption>>, name: keyof IProductTaxonomy) {
    return function (...params: Parameters<Exclude<AutocompleteProps<ComboBoxOption, false, true, true>['filterOptions'], undefined>>) {
        const [options, state] = params;
        const { inputValue } = state;
        const isExisting = options.some((option) => inputValue === (typeof option === 'string' ? option : option.value));
        const filters = filterOpt(options, state);
        if (inputValue !== '' && !isExisting) {
            filters.push({
                value: inputValue,
                parent: undefined,
                label: `Add "${inputValue}"`,
                node: getNode(name)
            });
        }
        return filters;
    };
}

const taxonomyFilter = createFilterOptions<ComboBoxOption>({
    ignoreCase: true,
    ignoreAccents: true,
    matchFrom: 'start',
    stringify: (option) => (typeof option === 'string' ? option : option.label)
});
export function OuterTaxonomyComboBox<T extends { taxon: IProductTaxonomy }>(outerProps: Pick<ITaxonomyComboBoxProps<T>, 'label' | 'name'>) {
    function TaxonomyComboBox(props: Pick<ITaxonomyComboBoxProps<IProductTaxonomy>, 'row' | 'table'>) {
        const { label, row, name, table } = { ...props, ...outerProps };
        const setEditCreateRow = useEditingOrCreatingRow(props.table, props.row);
        const [inputValue, setInputValue] = useState<ComboBoxOption | undefined>(undefined);
        const getOptionDisabled = useMemo(() => getOptionDisabledTaxonomy(table, row), [row, table]);
        const data = ddOptions(name);
        const onChange = useCallback(
            (...params: Parameters<Exclude<AutocompleteProps<ComboBoxOption, false, true, true>['onChange'], undefined>>) => {
                console.log('ONCHANGE', ...params);
                const [event, value, reason, details] = params;
                if (typeof value === 'string') {
                    setInputValue({ value, label: toProperFromCamel(value), node: getNode(name), parent: undefined });
                } else if (value && (value as any).inputValue) {
                    setInputValue({ value: (value as any).inputValue, label: toProperFromCamel((value as any).inputValue), node: getNode(name), parent: undefined });
                } else {
                    setInputValue(value);
                    props.row._valuesCache[name as keyof typeof props.row._valuesCache] = value?.value ?? undefined;
                    setEditCreateRow(props.row);
                }
            },
            [name, props, setEditCreateRow]
        );
        const $filterOptions = useMemo(() => taxonomyFilterOptions(taxonomyFilter, name), [name]);
        const isLoading = false;
        return (
            <Autocomplete<ComboBoxOption, false, true, true>
                options={data ?? []}
                value={inputValue}
                getOptionDisabled={getOptionDisabled}
                filterOptions={$filterOptions}
                freeSolo
                getOptionLabel={getOptionLabel}
                isOptionEqualToValue={isOptionEqualTo}
                groupBy={groupBy}
                renderGroup={renderGroup}
                onChange={onChange}
                selectOnFocus
                clearOnBlur
                handleHomeEndKeys
                filterSelectedOptions
                className='font-rubik'
                renderOption={(params, option, { selected }) => {
                    const cn = $cn(params, { 'bg-rose-500': selected }, 'aria-disabled:hidden')
                    return <li {...cn}>{typeof option === 'string' ? option : option.label}</li>;
                }}
                renderInput={(params) => (
                    <TextField
                        {...params}
                        label={label}
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
    return TaxonomyComboBox as any as MRT_ColumnDef<{ taxon: IProductTaxonomy }>['Edit'];
}
