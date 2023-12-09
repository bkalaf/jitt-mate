import { MRT_ColumnDef, MRT_RowData } from 'material-react-table';
import { CheckboxButtonGroup, useFormContext } from 'react-hook-form-mui';
import React from 'react';
import { toProperFromCamel } from '../../../common/text/toProperCase';
import { Flags, FlagsKeys } from '../../../dal/types';
import { useOnBlurContext } from '../creators/useOnBlurContext';

export const FlagsOptions = Flags.map((flag) => ({ id: flag, label: toProperFromCamel(flag) }));

export const flagsMeta = function <T extends MRT_RowData>() {
    return {
        header: 'Flags',
        Cell: (props: Parameters<Exclude<MRT_ColumnDef<T, DBSet<FlagsKeys>>['Cell'], undefined>>[0]) => {
            const values = props.cell.getValue();
            const output = Array.from(values.values()).map(toProperFromCamel).join(', ');
            return <span>{output}</span>;
        },
        id: 'flags',
        Edit: function (props: Parameters<Exclude<MRT_ColumnDef<T, DBSet<FlagsKeys>>['Edit'], undefined>>[0]) {
            const context = useFormContext();
            const onBlur = useOnBlurContext();
            return (
                <fieldset className='flex w-full'>
                    <legend>FLAGS</legend>
                    <CheckboxButtonGroup
                        control={context.control}
                        name={props.column.columnDef.accessorKey ?? props.column.columnDef.id ?? 'n/a'}
                        options={FlagsOptions}
                        onChange={onBlur(props.column.columnDef.accessorKey ?? props.column.columnDef.id ?? 'n/a')}
                        row
                    />
                </fieldset>
            );
        }
    };
};
