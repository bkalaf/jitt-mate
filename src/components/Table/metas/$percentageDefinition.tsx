import { MRT_RowData } from 'material-react-table';
import { PercentCell } from '../Cells/PercentCell'
import { JITTPercentageControl } from '../Controls/JITTPercentageControl'
import { toHeader } from '../toHeader';
import { Path } from 'react-hook-form-mui';

export function percentageDefinition<T extends MRT_RowData>(name: Path<T>, opts: { header?: string; max?: number; min?: number; readOnly?: boolean; required?: boolean } = {}, initalDisable = false, ...dependencies: IDependency[]) {
    return {
        accessorKey: name,
        header: toHeader(opts, name),
        Edit: JITTPercentageControl(opts, initalDisable, ...dependencies),
        Cell: PercentCell as any
    } as DefinedMRTColumn<T>
}

