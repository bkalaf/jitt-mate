import { DateCell } from './Cells/DateCell';
import { RHFM_TextControl } from './Controls/RHFM_TextControl';
import { toProperFromCamel } from '../../common/text/toProperCase';

export function dateMeta(name: string, opts: { header?: string; }) {
    return ({
        header: opts.header ?? toProperFromCamel(name),
        Cell: DateCell,
        meta: {
            valueIn: (x?: Date | null) => (x != null ? (typeof x === 'string' ? new Date(Date.parse(x)) : x instanceof Date ? x : null) : null)?.toLocaleString() ?? '',
            valueOut: (x?: string) => (x != null && x.length > 0 ? new Date(Date.parse(x)) : null),
            defaultValue: () => Promise.resolve(new Date(Date.now()))
        },
        Edit: RHFM_TextControl(name, opts.header ?? toProperFromCamel(name), undefined, undefined, undefined, undefined, undefined, 'datetime-local')
    });
}
