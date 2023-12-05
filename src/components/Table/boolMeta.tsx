import { CheckBoxCell } from './Cells/CheckBoxCell';
import { MRTBoolControl } from './MRTBoolControl';

export function boolMeta(opts: { propertyName: string; header: string; defaultValue?: boolean; required?: boolean; readOnly?: boolean; }) {
    return ({
        header: opts.header,
        Cell: CheckBoxCell,
        meta: {
            valueIn: (x?: string | boolean | null) => x?.toString() ?? '',
            valueOut: (x?: string | boolean) => (x == null ? null : typeof x === 'boolean' ? x : typeof x === 'string' ? (x === 'true' ? true : x === 'false' ? false : null) : null),
            defaultValue: false
        },
        enableEditing: !(opts.readOnly ?? false),
        Edit: (opts.readOnly ?? false) ? undefined : MRTBoolControl(opts.propertyName, opts.header, opts.defaultValue, opts.required)
    });
}
