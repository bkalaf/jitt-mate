import { PercentCell } from '../Cells/PercentCell'
import { MRTPercentageControl } from '../MRTPercentageControl'
import { toProperFromCamel } from '../../../common/text/toProperCase'
import { toHeader } from '../toHeader';

export function percentageMeta(name: string, { header, ...opts }: { header?: string; max?: number; min?: number } = {}) {
    return {
        header: toHeader({ header}, name),
        Edit: MRTPercentageControl(name, toHeader({ header }, name), opts),
        Cell: PercentCell as any
    }
}

