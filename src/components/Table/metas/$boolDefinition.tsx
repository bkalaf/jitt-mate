import { RHFM_CheckboxCell } from '../Cells/RHFM_CheckboxCell';
import { MRT_RowData } from 'material-react-table';
import { Path } from 'react-hook-form-mui';
import { toHeader } from '../toHeader';
import { JITTBoolControl } from '../Controls/JITTBoolControl';

export function boolDefinition<T extends MRT_RowData>(
    name: Path<T>,
    opts: { header?: string; defaultValue?: boolean; required?: boolean; readOnly?: boolean },
    initialDisable = false,
    ...dependencies: IDependency[]
) {
    const header = toHeader(opts, name);
    return {
        accessorKey: name,
        header: header,
        Cell: RHFM_CheckboxCell,
        enableEditing: !(opts.readOnly ?? false),
        Edit: opts.readOnly ?? false ? undefined : JITTBoolControl(opts, initialDisable, ...dependencies),
        enableColumnDragging: false,
        enableSorting: false,
        enableColumnFilter: false
    } as DefinedMRTColumn<T>;
}
