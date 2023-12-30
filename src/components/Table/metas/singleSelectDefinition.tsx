import { Path } from 'react-hook-form-mui';
import { toHeader } from '../toHeader';
import { MRT_RowData } from 'material-react-table';
import { JITTSingleSelectControl } from './JITTSingleSelectControl';
import { OuterSingleSelectCell } from './OuterSingleSelectCell';

export function singleSelectDefinition<T extends MRT_RowData>(name: Path<T>, { ...opts }: { header?: string; required?: boolean, enumType?: string }, initialDisable = false, ...dependencies: IDependency[]) {
    const header = toHeader(opts, name);
    return {
        accessorKey: name,
        header,
        Cell: OuterSingleSelectCell(opts),
        Edit: JITTSingleSelectControl(opts, initialDisable, ...dependencies)
    } as DefinedMRTColumn<T>;
}
