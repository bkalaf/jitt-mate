import { JITTIntegerControl } from '../Controls/JITTIntegerControl';
import { IntCell } from '../IntCell';
import { MRT_RowData } from 'material-react-table';
import { Path } from 'react-hook-form-mui';
import { toHeader } from '../toHeader';

export function intDefinition<T extends MRT_RowData>(name: Path<T>, opts: { header?: string; min?: number; max?: number; required?: boolean } = {}, initialDisable = false, ...dependencies: IDependency[]) {
    const header = toHeader(opts, name)
    return ({
        name,
        header,
        enableColumnActions: false,
        enableColumnDragging: false,
        Edit: JITTIntegerControl({ min: opts.min, max: opts.max }, initialDisable ?? false, ...dependencies),
        Cell: IntCell
    }) as DefinedMRTColumn<T>;
}
