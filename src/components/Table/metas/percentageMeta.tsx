import { PercentCell } from '../Cells/PercentCell'
import { MRTPercentageControl } from '../MRTPercentageControl'
import { toProperFromCamel } from '../../../common/text/toProperCase'

export function percentageMeta(name: string, opts: { header?: string; } = {}) {
    return {
        header: opts.header ?? toProperFromCamel(name),
        maxSize: 200,
        Edit: MRTPercentageControl(name, opts.header ?? toProperFromCamel(name)),
        Cell: PercentCell as any
    }
}

