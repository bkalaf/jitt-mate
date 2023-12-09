import { RHFM_CheckboxCell } from '../Cells/RHFM_CheckboxCell';
import { RHFM_BoolControl } from '../../Controls/RHFM_BoolControl';
import { MRT_ColumnDef, MRT_RowData } from 'material-react-table';

export function boolMeta<T extends MRT_RowData>(opts: { propertyName: string; header: string; defaultValue?: boolean; required?: boolean; readOnly?: boolean; }) {
    return ({
        header: opts.header,
        Cell: RHFM_CheckboxCell,
        enableEditing: !(opts.readOnly ?? false),
        Edit: (opts.readOnly ?? false) ? undefined : RHFM_BoolControl(opts.propertyName, opts.header, opts.defaultValue, opts.required),
        enableColumnDragging: false,
        enableSorting: false,
        enableColumnFilter: false
    } as MRT_ColumnDef<T, any>);
}
