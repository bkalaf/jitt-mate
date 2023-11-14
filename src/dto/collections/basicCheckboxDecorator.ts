import {
    $$bool,
    withCheckboxDecorator,
    withHeaderDecorator,
    withInputElementDecorator,
    withAutoHeaderDecorator, $$autoAccessorKey
} from '../../decorators/field/baseMetaDecorator';
import { pipeDecorators } from '../../schema/pipeDecorators';


export const basicCheckboxDecorator = function <T>(header?: string) {
    return pipeDecorators(withInputElementDecorator, $$bool, withCheckboxDecorator, $$autoAccessorKey, header ? withHeaderDecorator(header) : withAutoHeaderDecorator);
};
