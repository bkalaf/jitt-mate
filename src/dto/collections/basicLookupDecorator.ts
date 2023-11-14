import {
    withHeaderDecorator, asLookupObjectDecorator,
    $$object,
    withAutoHeaderDecorator, $$autoAccessorKey
} from '../../decorators/field/baseMetaDecorator';
import { withLabelPropertyDecorator } from '../../schema/decorators/labelProperty';
import { pipeDecorators } from '../../schema/pipeDecorators';

/**
* @deprecated
*/
export const basicLookupDecorator = function <T>(ot: RealmObjects, labelProperty: keyof T & string, header?: string) {
    return pipeDecorators($$object(ot), asLookupObjectDecorator, $$autoAccessorKey, withLabelPropertyDecorator(labelProperty), header ? withHeaderDecorator(header) : withAutoHeaderDecorator);
};
