import { pipeDecorators } from '../pipeDecorators';
import { colorMap } from '../decorators/colorMap';
import { datatype } from '../decorators/datatype';
import { enumMap, lookupEnumMap } from '../decorators/enumMap';


export function asEnum($enumMap: EnumMap<string, string>, $colorMap?: Record<string, string>, extraProperty?: string) {
    return pipeDecorators(datatype('enum'), enumMap($enumMap), ...($colorMap ? [colorMap($colorMap)] : []), lookupEnumMap($enumMap, extraProperty));
}
