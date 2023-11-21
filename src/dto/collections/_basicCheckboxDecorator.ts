import {
    $$bool,
    withCheckboxDecorator,
    withHeaderDecorator,
    withInputElementDecorator,
    withAutoHeaderDecorator, $$autoAccessorKey
} from '../../decorators/field/baseMetaDecorator';
import { pipeDecorators } from '../../schema/pipeDecorators';

/**
* @deprecated
*/
export const basicCheckboxDecorator = function (header?: string) {
    return pipeDecorators(withInputElementDecorator, $$bool, withCheckboxDecorator, $$autoAccessorKey, header ? withHeaderDecorator(header) : withAutoHeaderDecorator);
};
