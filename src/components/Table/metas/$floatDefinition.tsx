import { RHFM_FloatCell } from '../Cells/RHFM_FloatCell';
import { JITTFloatControl } from '../Controls/JITTFloatControl';
import { MRT_RowData } from 'material-react-table';
import { toHeader } from '../toHeader';
import { Path } from 'react-hook-form-mui';

export function floatDefinition<T extends MRT_RowData>(
    name: Path<T>,
    { ...rest }: { header?: string; min?: number; max?: number; precision: 1 | 2 | 3 | 4; required?: boolean; readOnly?: boolean; uom?: string; fn?: (x: T) => number },
    initialDisable = false,
    ...dependencies: IDependency[]
) {
    const $header = toHeader(rest, name);
    return {
        ...(rest.fn != null ? { accessorFn: rest.fn, id: name } : { accessorKey: name }),
        // accessorKey: name,
        header: $header,
        Cell: RHFM_FloatCell<T>(rest.precision ?? 2, rest.uom),
        Edit: JITTFloatControl(rest, initialDisable ?? false, ...dependencies),
        enableSorting: false,
        enableColumnFilter: false
    } as DefinedMRTColumn<T>;
}
