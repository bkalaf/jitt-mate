import { AutocompleteElement } from 'react-hook-form-mui';
import { MRT_ColumnDef } from 'material-react-table';
import { useDependencies } from '../../../hooks/useDependencies';
import { createFilterOptions } from '@mui/material';
import { useEnum } from '../../Contexts/useEnum';

export function JITTSingleSelectControl({ enumType, ...opts }: { required?: boolean; enumType?: string }, initialDisable = false, ...dependencies: IDependency[]) {
    return function InnerJITTSingleSelectControl(props: Parameters<Exclude<MRT_ColumnDef<any, any>['Edit'], undefined>>[0]) {
        const { name, label, disabled, onBlur, control, classes } = useDependencies(props, initialDisable, ...dependencies);
        const uniqueValues = props.column.getFacetedUniqueValues();
        console.log(uniqueValues);
        const { checkUniqueValues, enumMap, colorMap } = useEnum(enumType ?? name.split('.').reverse()[0]);
        const options = checkUniqueValues(uniqueValues)

        console.log(`pairs`, enumMap, colorMap, options);
        return (
            <AutocompleteElement
                name={name}
                label={label}
                options={options}
                control={control}
                autocompleteProps={{
                    classes,
                    disabled,
                    selectOnFocus: true,
                    clearOnBlur: true,
                    handleHomeEndKeys: true,
                    isOptionEqualToValue: (option, value) => {
                        console.log(`isOptionEqualToValue`, option, value);
                        return option.id === (typeof value === 'string' ? value : value.id);
                    },
                    filterOptions: (options, params) => {
                        const filter = createFilterOptions({
                            ignoreAccents: true,
                            ignoreCase: true,
                            limit: 200,
                            trim: true
                        });
                        const filtered = filter(options, params);
                        if (params.inputValue !== '') {
                            filtered.push({
                                inputValue: params.inputValue,
                                id: params.inputValue,
                                label: `ADD: ${params.inputValue}`
                            });
                        }
                        return filtered;
                    },
                    onChange: (ev, newValue) => {
                        if (newValue == null) {
                            onBlur({ target: { value: null, name } } as any);
                            return;
                        }
                        if (newValue === 'string') {
                            // console.error('should not get a string here');
                            onBlur({ target: { value: newValue, name } } as any);
                            return;
                        }
                        if (newValue && newValue.inputValue) {
                            onBlur({ target: { value: newValue.inputValue, name } } as any);
                            return;
                        }
                        onBlur({ target: { value: newValue.id, name }} as any);
                        return;
                    }
                }}
            />
        );
    };
}
