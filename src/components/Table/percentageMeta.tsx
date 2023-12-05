import { PercentCell } from './Cells/PercentCell';
import { MRTPercentageControl } from './MRTPercentageControl';
import { toProperFromCamel } from '../../common/text/toProperCase';

export function percentageMeta(name: string, opts: { header?: string; } = {}) {
    return {
        header: opts.header ?? toProperFromCamel(name),
        enableColumnActions: false,
        enableColumnDragging: false,
        maxSize: 200,
        meta: {
            valueIn: (x?: number | null) => x?.toFixed(4) ?? '',
            valueOut: (x?: string) => (x != null && typeof x === 'string' && x.length > 0 ? parseFloat(x) : x != null && typeof x === 'number' ? x : null),
            defaultValue: undefined
        },
        Edit: MRTPercentageControl(name, opts.header ?? toProperFromCamel(name)),
        Cell: PercentCell as any
    };
}
