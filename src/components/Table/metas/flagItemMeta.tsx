import { toProperFromCamel } from '../../../common/text/toProperCase';
import { RHFM_CheckboxCell } from '../Cells/RHFM_CheckboxCell';

export function flagItemMeta(propertyName: string, opts: { header?: string; } = {}) {
    return {
        id: propertyName,
        enableEditing: false,
        enableColumnDragging: false,
        enableSorting: false,
        enableColumnFilter: false,
        Cell: RHFM_CheckboxCell,
        header: opts.header ?? toProperFromCamel(propertyName),
        Edit: () => null
    };
}
