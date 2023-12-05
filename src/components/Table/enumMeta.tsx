import { MRTEnumControl } from './MRTLookupControl';
import { toProperFromCamel } from '../../common/text/toProperCase';
import { OuterEnumCell } from './OuterEnumCell';

export function enumMeta(name: string, enumMap: EnumMap, opts: { colorMap?: EnumMap; header?: string; } = {}) {
    return ({
        header: opts.header ?? toProperFromCamel(name),
        Cell: OuterEnumCell(enumMap, opts.colorMap),
        Edit: MRTEnumControl(name, opts.header ?? toProperFromCamel(name), enumMap),
        meta: {
            valueIn: (x?: string | null) => (x == null || x.length === 0 ? '' : x),
            valueOut: (x?: string) => (x == null || x.length === 0 ? null : (x as any)),
            defaultValue: undefined
        }
    });
}
