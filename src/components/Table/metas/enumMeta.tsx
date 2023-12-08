import { RHFM_EnumControl } from '../../Controls/RHFM_EnumControl';
import { toProperFromCamel } from '../../../common/text/toProperCase';
import { OuterEnumCell } from '../OuterEnumCell';

export function enumMeta(name: string, enumMap: EnumMap, opts: { colorMap?: EnumMap; header?: string } = {}) {
    return {
        header: opts.header ?? toProperFromCamel(name),
        Cell: OuterEnumCell(enumMap, opts.colorMap),
        Edit: RHFM_EnumControl(name, opts.header ?? toProperFromCamel(name), enumMap)
    };
}
