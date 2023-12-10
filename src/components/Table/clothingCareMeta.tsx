import { MRT_ColumnDef, MRT_RowData } from 'material-react-table';
import { CheckboxButtonGroup, useFormContext } from 'react-hook-form-mui';
import * as LaundryCareTypes from '../../../laundry-care.json';

export const LaundryCareOptions = Object.entries(LaundryCareTypes).map(([k, v]) => ({ id: k, label: v }));
export const clothingCareMeta = function <T extends MRT_RowData>() {
    return {
        header: 'Clothing Care',
        Cell: (props: Parameters<Exclude<MRT_ColumnDef<T, DBSet<keyof typeof LaundryCareTypes>>['Cell'], undefined>>[0]) => {
            const values = props.cell.getValue();
            const output = Array.from(values.values()).join('\n');
            return <span>{output}</span>;
        },
        Edit: function (props: Parameters<Exclude<MRT_ColumnDef<T, DBSet<keyof typeof LaundryCareTypes>>['Edit'], undefined>>[0]) {
            const context = useFormContext();
            return (
                <fieldset className='flex w-full'>
                    <legend>CLOTHING CARE OPTIONS</legend>
                    <CheckboxButtonGroup control={context.control} name={props.column.columnDef.accessorKey ?? props.column.columnDef.id ?? 'n/a'} options={LaundryCareOptions} row />
                </fieldset>
            );
        }
    };
};
