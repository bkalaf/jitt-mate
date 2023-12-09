import { DollarCell } from '../Cells/DollarCell';
import { toProperFromCamel } from '../../../common/text/toProperCase';
import { MRTDollarControl } from '../MRTDollarControl';


export function dollarMeta(name: string, opts: { header?: string; } = {}) {
    return {
        header: opts.header ?? toProperFromCamel(name.split('.').reverse()[0]),
        maxSize: 200,
        Edit: MRTDollarControl(name, opts.header ?? toProperFromCamel(name.split('.').reverse()[0])),
        Cell: DollarCell
    };
}
