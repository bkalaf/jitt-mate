import {
    withHeaderDecorator, withAutoHeaderDecorator, $$autoAccessorKey, $$colorMap,
    $$valuesGetter,
    $$enum,
    $$picklist,
    $$select
} from '../../decorators/field/baseMetaDecorator';
import { pipeDecorators } from '../../schema/pipeDecorators';

/**
* @deprecated
*/
export const basicEnumDecorator = function <T>(opts?: { enumMap?: Record<string, string>; colorMap?: Record<string, string>; valuesGetter?: (x: T) => Record<string, string>; }, header?: string) {
    const { enumMap, colorMap, valuesGetter } = opts ?? {};
    const pipes = [...(enumMap ? [$$enum(enumMap)] : []), ...(colorMap ? [$$colorMap(colorMap)] : []), ...(valuesGetter ? [$$valuesGetter(valuesGetter)] : [])];
    return pipeDecorators($$picklist, $$select, $$autoAccessorKey, header ? withHeaderDecorator(header) : withAutoHeaderDecorator, ...pipes);
};
