import { DollarCell } from '../Cells/DollarCell';
import { JITTDollarControl } from '../Controls/JITTDollarControl';
import { MRT_RowData } from 'material-react-table';
import { Path } from 'react-hook-form-mui';
import { toHeader } from '../toHeader';

export function dollarDefinition<T extends MRT_RowData>(name: Path<T>, opts: { header?: string; required?: boolean; readOnly?: boolean; max?: number, min?: number } = {}, initialDisable = false, ...dependencies: IDependency[]) {
    const header = toHeader(opts, name);
    return {
        accessorKey: name,
        header,
        Edit: JITTDollarControl(opts, initialDisable, ...dependencies),
        Cell: DollarCell
    } as DefinedMRTColumn<T>;
}
