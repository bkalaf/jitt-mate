import { BarcodeCell } from './Cells/BarcodeCell';
import { toProperFromCamel } from '../../common/text/toProperCase';

export function barcodeMeta(name: string, opts: { header?: string; } = {}) {
    return {
        header: opts.header ?? toProperFromCamel(name),
        meta: {
            // valueIn: (x?: string | null) => x ?? '',
            // valueOut: (x?: string) => (x != null && x.length > 0 ? x : null),
            defaultValue: undefined
        },
        enableEditing: false,
        Cell: BarcodeCell as any
    };
}
