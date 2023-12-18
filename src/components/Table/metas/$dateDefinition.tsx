import { DateCell } from '../Cells/DateCell';
import { JITTTextControl } from '../Controls/JITTTextControl';
import { toProperFromCamel } from '../../../common/text/toProperCase';
import { MRT_RowData } from 'material-react-table';
import { Path } from 'react-hook-form-mui';
import { toHeader } from '../toHeader';

export function dateDefinition<T extends MRT_RowData>(
    name: Path<T>,
    opts: { header?: string; required?: boolean; readOnly?: boolean; type?: 'datetime-local' | 'date' | 'time' },
    initialDisable = false,
    ...dependencies: IDependency[]
) {
    const header = toHeader(opts, name);
    return {
        accessorKey: name,
        header,
        Cell: DateCell,
        Edit: JITTTextControl({ required: opts.required ?? false, readOnly: opts.readOnly ?? false, type: opts.type ?? 'datetime-local' }, initialDisable, ...dependencies)
    } as DefinedMRTColumn<T>;
}
