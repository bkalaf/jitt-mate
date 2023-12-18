import { JITTTextControl } from '../Controls/JITTTextControl';
import React from 'react';
import { toHeader } from '../toHeader';
import { Path } from 'react-hook-form-mui';
import { MRT_RowData } from 'material-react-table';

export function stringDefinition<T extends MRT_RowData>(name: Path<T>, { ...opts }: { header?: string; maxLength?: number; minLength?: number; pattern?: RegExp; patternMsg?: string; readOnly?: boolean; required?: boolean; type?: React.HTMLInputTypeAttribute; fn?: (x: T) => string }, initialDisable = false, ...dependencies: IDependency[]) {
    const header = toHeader(opts, name)
    return {
        ...(opts.fn != null ? { accessorFn: opts.fn, id: name } : { accessorKey: name }),
        header: header,
        enableEditing: !(opts.readOnly ?? false),
        Edit: JITTTextControl(opts, initialDisable, ...dependencies),
        muiTableHeadCellProps: {
            'aria-required': opts.required ?? false
        }
    } as DefinedMRTColumn<T>;
}
