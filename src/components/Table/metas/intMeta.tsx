import { MRTIntegerControl } from '../MRTIntegerControl';
import { toProperFromCamel } from '../../../common/text/toProperCase';
import { IntCell } from '../IntCell';

export function intMeta(name: string, opts: { header?: string; min?: number; max?: number; } = {}) {
    return ({
        header: opts.header ?? toProperFromCamel(name),
        enableColumnActions: false,
        enableColumnDragging: false,
        maxSize: 200,
        meta: {
            valueIn: (x?: number | null) => x?.toFixed(4) ?? '',
            valueOut: (x?: string) => (x != null && typeof x === 'string' && x.length > 0 ? parseFloat(x) : x != null && typeof x === 'number' ? x : null),
            defaultValue: undefined
        },
        Edit: MRTIntegerControl(name, opts.header ?? toProperFromCamel(name), { min: opts.min, max: opts.max }),
        Cell: IntCell
    });
}
